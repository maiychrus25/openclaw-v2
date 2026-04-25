# Infrastructure as Code (IaC) Reference Guide

## Overview
This guide defines the standards for managing and provisioning infrastructure through machine-readable definition files. For a Senior DevOps, IaC is not just about automation—it is about applying software engineering practices (version control, testing, CI/CD) to the underlying platform.

---

## Patterns and Practices

### Pattern 1: Modular Infrastructure
**Description:**
Breaking down monolithic infrastructure code into small, reusable, and independent modules. Each module should have a single responsibility (e.g., an S3 bucket module, a VPC module).

**When to Use:**
- When managing complex environments across multiple regions or accounts.
- When multiple teams need to share standardized infrastructure components.
- To reduce the blast radius of changes.

**Implementation (Terraform Example):**
```hcl
// Calling a reusable VPC module
module "network" {
  source = "./modules/vpc"
  
  cidr_block      = "10.0.0.0/16"
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  enable_nat_gateway = true
}
```

**Benefits:**
- **DRY (Don't Repeat Yourself):** Reduces code duplication.
- **Consistency:** Ensures every environment follows the same architecture.
- **Easier Testing:** Modules can be tested in isolation.

**Trade-offs:**
- **Dependency Management:** Changes to a core module can impact many downstream stacks.
- **Abstraction Overload:** Too many layers can make debugging difficult.

### Pattern 2: GitOps for IaC
**Description:**
Using Git as the source of truth for infrastructure. Changes are applied via Pull Requests, and an automated agent (like Atlantis or Terraform Cloud) ensures the "live" state matches the "desired" state in Git.

**Implementation:**
1. Developer creates a PR with IaC changes.
2. Automation runs `terraform plan` and comments on the PR.
3. Senior DevOps reviews and approves.
4. On merge, automation runs `terraform apply`.

---

## Guidelines

### Code Organization
- **State Separation:** Use remote backends (S3/GCS) with state locking (DynamoDB). Never store state files in Git.
- **Layered Architecture:** Separate "Foundational" layers (VPC, DNS) from "Application" layers (ECS, RDS).
- **Environment Parity:** Use Workspaces or separate directory structures to keep Dev, Staging, and Prod consistent.

### Performance Considerations
- **Parallelism:** Optimize resource creation by using `depends_on` only when strictly necessary.
- **Targeting:** Use `-target` sparingly for debugging; rely on small state files to speed up execution.
- **Refresh Optimization:** Disable automatic state refresh for massive stacks if you only need a quick plan.

### Security Best Practices
- **Least Privilege:** IaC runners should use IAM roles with restricted permissions, not admin keys.
- **Static Analysis:** Run tools like `tfsec` or `checkov` in the CI pipeline to catch misconfigured Security Groups or unencrypted buckets.
- **Sensitive Data:** Use sensitive variable flags or integration with Vault to avoid leaking secrets in logs.

---

## Common Patterns

### Pattern A: Multi-Region Failover
Using IaC to replicate identical stacks in secondary regions with automated DNS failover (Route53).

### Pattern B: Golden Image Pipeline
Combining IaC with Image builders (Packer) to create pre-hardened OS images (AMIs) before deployment.

### Pattern C: Resource Tagging Strategy
Enforcing strict tagging via IaC for cost allocation (FinOps) and automated cleanup policies.

---

## Anti-Patterns to Avoid

1. **Hardcoding Values**
   - **Issue:** Writing IP addresses, ARNs, or Instance IDs directly in code.
   - **Fix:** Use Data Sources or Input Variables to fetch values dynamically.

2. **Manual State Editing**
   - **Issue:** Modifying the state file manually to fix a resource conflict.
   - **Fix:** Always use `terraform import`, `terraform rm`, or `terraform state mv` commands.

3. **The "God" Module**
   - **Issue:** One single module that creates everything (VPC, DB, App, Monitoring).
   - **Fix:** Decompose into smaller, composable units.

---

## Tools and Resources

### Recommended Tools
- **Provisioning:** Terraform, OpenTofu, Pulumi (for Cloud Native).
- **Configuration:** Ansible, SaltStack.
- **Validation:** Terratest (Go-based testing), TFLint, Checkov.
- **Drift Detection:** Driftctl, CloudSpend.

### Further Reading
- [Terraform Up & Running - Yevgeniy Brikman](https://www.terraformupandrunning.com/)
- [Infrastructure as Code - Kief Morris](https://www.oreilly.com/library/view/infrastructure-as-code/9781491924341/)

---

## Conclusion
IaC is the foundation of modern DevOps. By treating your infrastructure as code, you gain the ability to version, test, and scale your platform with the same rigor as your application logic. **If it's not in Git, it doesn't exist.**
