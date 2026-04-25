#!/usr/bin/env bash
# Google Stitch CLI — generates UI designs via upstream Stitch MCP API
# Requires: STITCH_API_KEY env var
# Rate limit: enforces minimum 5-minute gap between generate calls

set -euo pipefail

STITCH_MCP_URL="https://stitch.googleapis.com/mcp"
API_KEY="${STITCH_API_KEY:-}"
OUTPUT_DIR="."
MODEL="GEMINI_3_FLASH"
DEVICE="DESKTOP"
RATE_LIMIT_FILE="/tmp/.stitch_last_call"
RATE_LIMIT_SECONDS=300  # 5 minutes

die() { echo "ERROR: $*" >&2; exit 1; }

check_api_key() {
  [[ -n "$API_KEY" ]] || die "STITCH_API_KEY not set. Get one from stitch.withgoogle.com → Profile → Stitch Settings → API Keys"
}

rate_limit_check() {
  if [[ -f "$RATE_LIMIT_FILE" ]]; then
    local last_call
    last_call=$(cat "$RATE_LIMIT_FILE")
    local now
    now=$(date +%s)
    local elapsed=$(( now - last_call ))
    if (( elapsed < RATE_LIMIT_SECONDS )); then
      local wait_time=$(( RATE_LIMIT_SECONDS - elapsed ))
      echo "Rate limit: waiting ${wait_time}s (1 request per ${RATE_LIMIT_SECONDS}s)..."
      sleep "$wait_time"
    fi
  fi
  date +%s > "$RATE_LIMIT_FILE"
}

mcp_call() {
  local method_name="$1"
  local arguments="$2"
  local call_id="${3:-1}"

  curl -sS --max-time 300 "$STITCH_MCP_URL" \
    -H 'Content-Type: application/json' \
    -H "X-Goog-Api-Key: ${API_KEY}" \
    -d "{
      \"jsonrpc\": \"2.0\",
      \"id\": ${call_id},
      \"method\": \"tools/call\",
      \"params\": {
        \"name\": \"${method_name}\",
        \"arguments\": ${arguments}
      }
    }"
}

mcp_list_tools() {
  curl -sS --max-time 30 "$STITCH_MCP_URL" \
    -H 'Content-Type: application/json' \
    -H "X-Goog-Api-Key: ${API_KEY}" \
    -d '{"jsonrpc":"2.0","id":0,"method":"tools/list","params":{}}'
}

cmd_generate() {
  local prompt="$1"
  shift
  local project_id=""

  while [[ $# -gt 0 ]]; do
    case "$1" in
      --model)   [[ "$2" == "pro" ]] && MODEL="GEMINI_3_PRO" || MODEL="GEMINI_3_FLASH"; shift 2 ;;
      --device)  DEVICE=$(echo "$2" | tr '[:lower:]' '[:upper:]'); shift 2 ;;
      --project) project_id="$2"; shift 2 ;;
      --output)  OUTPUT_DIR="$2"; shift 2 ;;
      *) die "Unknown flag: $1" ;;
    esac
  done

  check_api_key
  mkdir -p "$OUTPUT_DIR"

  # Create project if none specified
  if [[ -z "$project_id" ]]; then
    echo "Creating new project..."
    local proj_result
    proj_result=$(mcp_call "create_project" "{\"title\": \"Generated Design $(date +%Y%m%d_%H%M%S)\"}")
    project_id=$(echo "$proj_result" | jq -r '.result.structuredContent.name // .result.content[0].text' 2>/dev/null | grep -oP '\d{10,}' | head -1)
    [[ -n "$project_id" ]] || die "Failed to create project: $proj_result"
    echo "Project ID: $project_id"
  fi

  # Rate limit before generation
  rate_limit_check

  echo "Generating design with ${MODEL} for ${DEVICE}..."
  local prompt_json
  prompt_json=$(jq -Rn --arg p "$prompt" '$p')
  
  local result
  result=$(mcp_call "generate_screen_from_text" \
    "{\"projectId\": \"${project_id}\", \"prompt\": ${prompt_json}, \"deviceType\": \"${DEVICE}\", \"modelId\": \"${MODEL}\"}" 2)

  # Parse response — handle both structured and text content
  local structured
  structured=$(echo "$result" | jq '.result.structuredContent // empty' 2>/dev/null)
  
  if [[ -z "$structured" || "$structured" == "null" ]]; then
    # Try parsing from text content
    structured=$(echo "$result" | jq -r '.result.content[0].text // empty' 2>/dev/null | jq '.' 2>/dev/null || true)
  fi

  if [[ -z "$structured" || "$structured" == "null" ]]; then
    echo "$result" | jq '.' 2>/dev/null || echo "$result"
    die "No structured content in response"
  fi

  # Extract screens and download
  local screen_count
  screen_count=$(echo "$structured" | jq '[.outputComponents[]?.design?.screens[]?] | length' 2>/dev/null || echo 0)
  echo "Generated ${screen_count} screen(s)"

  echo "$structured" | jq -r '.outputComponents[]?.design?.screens[]? | "\(.id)\t\(.title)\t\(.screenshot.downloadUrl)\t\(.htmlCode.downloadUrl)"' 2>/dev/null | while IFS=$'\t' read -r sid title screenshot_url html_url; do
    local safe_title
    safe_title=$(echo "$title" | tr ' /' '_' | tr -cd '[:alnum:]_-')
    
    if [[ -n "$screenshot_url" && "$screenshot_url" != "null" ]]; then
      local img_file="${OUTPUT_DIR}/${safe_title}_${sid:0:8}.png"
      echo "Downloading screenshot → ${img_file}"
      curl -sS -L -o "$img_file" "${screenshot_url}=s2560" && echo "  Saved: ${img_file} ($(du -h "$img_file" | cut -f1))" || echo "  WARN: screenshot download failed"
    fi

    if [[ -n "$html_url" && "$html_url" != "null" ]]; then
      local html_file="${OUTPUT_DIR}/${safe_title}_${sid:0:8}.html"
      echo "Downloading HTML → ${html_file}"
      curl -sS -L -o "$html_file" "$html_url" && echo "  Saved: ${html_file} ($(du -h "$html_file" | cut -f1))" || echo "  WARN: HTML download failed"
    fi
  done

  # Show suggestions
  echo ""
  echo "$structured" | jq -r '.outputComponents[]? | select(.suggestion) | "  💡 " + .suggestion' 2>/dev/null
  echo "$structured" | jq -r '.outputComponents[]? | select(.text) | .text' 2>/dev/null
  echo ""
  echo "Project: https://stitch.withgoogle.com/project/${project_id}"
  echo "Project ID: ${project_id}"
}

cmd_list_projects() {
  check_api_key
  mcp_call "list_projects" '{}' | jq '.result.structuredContent // .result.content[0].text' 2>/dev/null
}

cmd_get_project() {
  local project_id="${1:?Usage: stitch.sh get-project <project_id>}"
  check_api_key
  mcp_call "get_project" "{\"name\": \"projects/${project_id}\"}" | jq '.result.structuredContent // .result' 2>/dev/null
}

cmd_list_screens() {
  local project_id="${1:?Usage: stitch.sh list-screens <project_id>}"
  check_api_key
  mcp_call "list_screens" "{\"projectName\": \"projects/${project_id}\"}" | jq '.result.structuredContent // .result' 2>/dev/null
}

cmd_download() {
  local project_id="${1:?Usage: stitch.sh download <project_id> <screen_id> [--output dir]}"
  local screen_id="${2:?Usage: stitch.sh download <project_id> <screen_id> [--output dir]}"
  shift 2

  while [[ $# -gt 0 ]]; do
    case "$1" in
      --output) OUTPUT_DIR="$2"; shift 2 ;;
      *) die "Unknown flag: $1" ;;
    esac
  done

  check_api_key
  mkdir -p "$OUTPUT_DIR"

  local result
  result=$(mcp_call "get_screen" "{\"name\": \"projects/${project_id}/screens/${screen_id}\"}")

  local screenshot_url html_url title
  screenshot_url=$(echo "$result" | jq -r '.result.structuredContent.screenshot.downloadUrl // empty' 2>/dev/null)
  html_url=$(echo "$result" | jq -r '.result.structuredContent.htmlCode.downloadUrl // empty' 2>/dev/null)
  title=$(echo "$result" | jq -r '.result.structuredContent.title // "screen"' 2>/dev/null)
  local safe_title=$(echo "$title" | tr ' /' '_' | tr -cd '[:alnum:]_-')

  if [[ -n "$screenshot_url" ]]; then
    local img_file="${OUTPUT_DIR}/${safe_title}_${screen_id:0:8}.png"
    curl -sS -L -o "$img_file" "${screenshot_url}=s2560" && echo "Saved: ${img_file}"
  fi
  if [[ -n "$html_url" ]]; then
    local html_file="${OUTPUT_DIR}/${safe_title}_${screen_id:0:8}.html"
    curl -sS -L -o "$html_file" "$html_url" && echo "Saved: ${html_file}"
  fi
}

cmd_tools() {
  check_api_key
  mcp_list_tools | jq -r '.result.tools[]?.name' 2>/dev/null
}

# --- Main dispatch ---
CMD="${1:-help}"
shift || true

case "$CMD" in
  generate)       cmd_generate "$@" ;;
  list-projects)  cmd_list_projects ;;
  get-project)    cmd_get_project "$@" ;;
  list-screens)   cmd_list_screens "$@" ;;
  download)       cmd_download "$@" ;;
  tools)          cmd_tools ;;
  help|--help|-h)
    echo "Google Stitch CLI (upstream MCP)"
    echo ""
    echo "Commands:"
    echo "  generate <prompt> [--model flash|pro] [--device desktop|mobile|tablet] [--project id] [--output dir]"
    echo "  list-projects"
    echo "  get-project <project_id>"
    echo "  list-screens <project_id>"
    echo "  download <project_id> <screen_id> [--output dir]"
    echo "  tools                          List available MCP tools"
    echo ""
    echo "Environment:"
    echo "  STITCH_API_KEY   (required) API key from stitch.withgoogle.com"
    echo ""
    echo "Rate limiting: ${RATE_LIMIT_SECONDS}s between generate calls (configurable via RATE_LIMIT_FILE)"
    ;;
  *) die "Unknown command: $CMD. Run with --help" ;;
esac
