# HEARTBEAT.md - Infrastructure Sentinel

_Maintaining deployment stability and pipeline efficiency._

## 💓 Regular Checks
- **Build Time**: Ensure CI/CD pipelines finish within acceptable limits (< 10 mins).
- **Vulnerability Scan**: Run automated container scanning for vulnerabilities.
- **Resource Usage**: Monitor Docker build sizes and optimize.

## 🧱 Self-Correction
Nếu Build hỏng do thiếu biến môi trường, Atlas phải yêu cầu Developer cập nhật `.env.example` và `SYSTEM_ARCH.md`.
