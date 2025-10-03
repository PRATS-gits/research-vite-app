# MinIO Configuration Guide for Research Space

> **Created:** October 1, 2025  
> **Purpose:** Comprehensive guide for configuring MinIO bucket for Research Space Library  
> **Status:** 🟢 Ready for Testing

---

## 🎯 **MinIO Bucket Configuration**

### **Bucket Name**
```
research-space-library
```

### **✅ Recommended Feature Settings**

#### **1. Versioning: ON** ✅
- **Purpose:** Maintains version history of all files
- **Benefit:** Enables recovery from accidental deletions or overwrites
- **Use Case:** Critical for research data integrity
- **Backend Support:** Already planned in architecture
- **Storage Impact:** Minimal for small files, increases with modifications

**Why Enable:**
- Research files are valuable and need protection
- Users can revert to previous versions if needed
- Accidental edits can be undone
- Supports audit trail requirements

---

#### **2. Object Locking: ON** ✅
- **Purpose:** Write-Once-Read-Many (WORM) protection
- **Benefit:** Prevents accidental or malicious deletion
- **Mode:** **Compliance** (recommended for research)
- **Governance vs Compliance:**
  - **Governance:** Can be overridden with special permissions
  - **Compliance:** Cannot be overridden even by root (stricter)

**Why Enable:**
- Research data integrity is paramount
- Prevents accidental bulk deletions
- Supports regulatory compliance (if needed)
- Required for retention policies

**⚠️ IMPORTANT:** Object locking MUST be enabled at bucket creation. Cannot be enabled later.

---

#### **3. Retention: ON** ✅
- **Purpose:** Enforces minimum retention period for objects
- **Mode:** **Compliance** (30 days)
- **Validity Period:** **30 days** (recommended starting point)

**Retention Settings:**
```
Mode: Compliance
Duration: 30 days
```

**Why 30 Days:**
- Provides reasonable protection window
- Prevents accidental deletions in first month
- Can be extended per-object if needed
- Balances protection with flexibility

**Future Considerations:**
- Can set longer retention for specific files via API
- Can increase default retention period later
- Research projects may require 90-180 day retention

---

#### **4. Quota: OFF** ❌
- **Purpose:** Limits total bucket storage capacity
- **Recommendation:** Start without quota, monitor usage
- **Future Setup:** Set quota after understanding usage patterns

**Why Disable Initially:**
- Unknown storage requirements during testing
- Prevents premature errors during development
- Can be enabled later based on actual usage
- Easier to test file operations without limits

**When to Enable:**
- After establishing baseline usage patterns
- If multi-tenant system needs resource limits
- For production cost management

---

## 🔐 **MinIO Access Configuration**

### **Required Credentials**

After creating the bucket, obtain these credentials from MinIO Console:

```bash
# Navigate to: MinIO Console → Access Keys → Create New Access Key

Endpoint: http://localhost:9000  # or your MinIO server URL
Access Key: <generated-access-key>  # e.g., minioadmin
Secret Key: <generated-secret-key>  # e.g., minioadmin
Region: us-east-1  # MinIO default, or your configured region
Bucket: research-space-library
```

### **Access Key Permissions**

Ensure the access key has these permissions:
- ✅ `s3:PutObject` - Upload files
- ✅ `s3:GetObject` - Download files
- ✅ `s3:DeleteObject` - Delete files
- ✅ `s3:ListBucket` - List files in bucket
- ✅ `s3:GetObjectVersion` - Access file versions (if versioning enabled)
- ✅ `s3:PutObjectRetention` - Set retention policies
- ✅ `s3:GetObjectRetention` - Check retention status

---

## 🧪 **Testing Connection via Connections Page**

### **Step 1: Start Backend Server**
```bash
cd backend
npm run dev
# Server should start at http://localhost:3001
```

### **Step 2: Start Frontend Development Server**
```bash
cd .. # back to root
npm run dev
# Frontend should start at http://localhost:5173
```

### **Step 3: Navigate to Connections Page**
```
http://localhost:5173/connections
```

### **Step 4: Fill Configuration Form**
```
Provider: MinIO
Endpoint: http://localhost:9000
Access Key: <your-access-key>
Secret Key: <your-secret-key>
Region: us-east-1
Bucket Name: research-space-library
```

### **Step 5: Test Connection**
1. Click "Test Connection" button
2. Wait for backend to validate credentials
3. Verify success message appears
4. Check connection status indicator turns green

### **Expected Test Results**

**✅ Success Response:**
```json
{
  "status": "success",
  "message": "Connection test successful",
  "details": {
    "provider": "minio",
    "bucketExists": true,
    "hasReadAccess": true,
    "hasWriteAccess": true,
    "versioningEnabled": true,
    "responseTime": "1.8s"
  }
}
```

**❌ Failure Scenarios:**

1. **Invalid Credentials:**
```json
{
  "status": "error",
  "message": "Invalid access credentials",
  "code": "InvalidAccessKeyId"
}
```

2. **Bucket Not Found:**
```json
{
  "status": "error",
  "message": "Bucket does not exist",
  "code": "NoSuchBucket"
}
```

3. **Network Error:**
```json
{
  "status": "error",
  "message": "Cannot reach MinIO server",
  "code": "NetworkError"
}
```

---

## 🔒 **Configuration Lock Behavior**

### **After First Successful Configuration:**

1. **Configuration is Locked:**
   - Cannot change provider (MinIO → S3 blocked)
   - Cannot change endpoint
   - Cannot change bucket name
   - Credentials remain editable (for rotation)

2. **Warning Modal Appears:**
```
⚠️ Configuration Lock Warning

Once you save this configuration, the storage provider, endpoint, 
and bucket cannot be changed. This prevents accidental data loss 
and ensures consistency.

Are you sure you want to proceed?

[Cancel] [Confirm and Lock]
```

3. **Lock Status Display:**
```
🔒 Configuration Locked
Provider: MinIO
Bucket: research-space-library
Locked Since: October 1, 2025 10:30 AM
```

### **Admin Override (If Needed):**

```bash
# In backend, use admin endpoint to unlock configuration
curl -X POST http://localhost:3001/api/storage/unlock \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"confirmUnlock": true}'
```

---

## 📊 **MinIO Bucket Verification Checklist**

### **Pre-Configuration:**
- [ ] MinIO server running (http://localhost:9000)
- [ ] Bucket `research-space-library` created
- [ ] Versioning enabled on bucket
- [ ] Object Locking enabled on bucket
- [ ] Retention policy set (Compliance, 30 days)
- [ ] Access key created with proper permissions
- [ ] Secret key saved securely

### **Backend Configuration:**
- [ ] Backend server running (http://localhost:3001)
- [ ] API endpoints responding:
  - [ ] POST /api/storage/configure
  - [ ] POST /api/storage/test
  - [ ] GET /api/storage/status
- [ ] Database configured for credential storage
- [ ] Encryption key set in .env file

### **Frontend Configuration:**
- [ ] Frontend running (http://localhost:5173)
- [ ] Connections page accessible
- [ ] Provider dropdown shows MinIO option
- [ ] Form validation working
- [ ] Test connection button functional

### **Connection Test:**
- [ ] Form submitted successfully
- [ ] Backend validates credentials
- [ ] Connection test passes
- [ ] Success notification appears
- [ ] Configuration saved to database
- [ ] Lock mechanism activates

---

## 🐛 **Troubleshooting Common Issues**

### **Issue 1: "Cannot reach MinIO server"**

**Cause:** Network connectivity or incorrect endpoint

**Solutions:**
1. Verify MinIO is running:
```bash
docker ps | grep minio
# or
curl http://localhost:9000/minio/health/live
```

2. Check endpoint URL format:
```
✅ Correct: http://localhost:9000
❌ Wrong: http://localhost:9000/
❌ Wrong: localhost:9000
❌ Wrong: https://localhost:9000 (if not using HTTPS)
```

3. Test with MinIO CLI:
```bash
mc alias set local http://localhost:9000 <access-key> <secret-key>
mc ls local/research-space-library
```

---

### **Issue 2: "Bucket does not exist"**

**Cause:** Bucket name typo or bucket not created

**Solutions:**
1. Verify bucket name exactly matches:
```bash
mc ls local/  # List all buckets
```

2. Create bucket if missing:
```bash
mc mb local/research-space-library
mc version enable local/research-space-library
```

---

### **Issue 3: "Access Denied" or "Permission Error"**

**Cause:** Insufficient access key permissions

**Solutions:**
1. Verify access key policy:
```bash
mc admin user info local <access-key>
```

2. Create policy with required permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:*"
      ],
      "Resource": [
        "arn:aws:s3:::research-space-library/*",
        "arn:aws:s3:::research-space-library"
      ]
    }
  ]
}
```

3. Apply policy to access key:
```bash
mc admin policy attach local research-space-policy --user=<access-key>
```

---

### **Issue 4: "Versioning not enabled" error**

**Cause:** Bucket created without versioning

**Solutions:**
1. Enable versioning on existing bucket:
```bash
mc version enable local/research-space-library
```

2. Verify versioning status:
```bash
mc version info local/research-space-library
```

---

### **Issue 5: "Object locking not supported" error**

**Cause:** Object locking not enabled at bucket creation

**Solutions:**
⚠️ **Object locking cannot be enabled on existing buckets**

1. Delete and recreate bucket with locking:
```bash
mc rb local/research-space-library --force
mc mb local/research-space-library --with-lock
```

2. Re-enable versioning and retention:
```bash
mc version enable local/research-space-library
```

---

## 📚 **Additional Resources**

### **MinIO Documentation:**
- [Object Locking](https://min.io/docs/minio/linux/administration/object-management/object-retention.html)
- [Versioning](https://min.io/docs/minio/linux/administration/object-management/object-versioning.html)
- [Bucket Policies](https://min.io/docs/minio/linux/administration/identity-access-management/policy-based-access-control.html)

### **Backend API Documentation:**
- `backend/docs/API_DOCUMENTATION.md`
- `backend/docs/PHASE1_SUMMARY.md`

### **Related Project Files:**
- `docs/plans/backend/BACKEND_PLAN.md` (Phase 1)
- `docs/plans/frontend/FRONTEND_PLAN.md` (Phase 3)
- `docs/EXECUTION_SEQUENCE.md` (Overall coordination)

---

## ✅ **Ready to Proceed**

Once MinIO is configured with the recommended settings and connection test passes:

1. ✅ Configuration is locked
2. ✅ Backend Phase 2 can begin (File Operations API)
3. ✅ Frontend Library Page will use this storage for real file operations

**Next Step:** Start Backend Agent Phase 2 (File Operations & Upload System)

---

**Document Status:** 🟢 Complete  
**Last Updated:** October 1, 2025  
**Author:** Planner Agent  
**For Questions:** Contact backend developer or review BACKEND_PLAN.md Phase 1
