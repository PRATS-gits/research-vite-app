# Research Space - Agent Execution Sequence & Coordination

> **Created:** September 30, 2025
> **Last Updated:** October 1, 2025
> **Status:** 🟢 Active Execution Guide
> **Version:** 1.2

## 🎯 **Execution Overview**

This document provides the precise sequence for executing FRONTEND_PLAN.md v1.2 and BACKEND_PLAN.md v1.0 with proper agent coordination and dependency management.

---

## 📋 **Phase Execution Sequence**

### **🟢 STAGE 1: Frontend UI Foundation (Parallel Start)**

#### **Step 1: Frontend Agent - Phase 1** ✅ **COMPLETED**
**Agent:** Frontend Developer Agent  
**Phase:** Library Page Advanced UI Components (Google Drive Experience)  
**Dependencies:** None - Can start immediately  
**Duration:** ~2-3 days  
**Status:** ✅ Complete (October 1, 2025)

**Prompt:**
```
Frontend Agent: Please implement Phase 1 from FRONTEND_PLAN.md v1.2:
"Library Page Advanced UI Components (Google Drive Experience)"

Focus on:
1. Install @dnd-kit dependencies and setup drag-and-drop system
2. Create FileCard and FolderCard components with mock data
3. Implement nested folder navigation with breadcrumbs
4. Build multi-select checkbox system
5. Add rename modal and context menus
6. Create global drop zone component

Use mock data for now - no backend integration required.
Reference: docs/plans/frontend/FRONTEND_PLAN.md (Lines 11-121)
```

**Deliverables:** ✅ **ALL COMPLETE**
- ✅ Functional drag-and-drop file/folder cards
- ✅ Nested folder navigation working
- ✅ Multi-select system operational
- ✅ All UI components rendering correctly
- ✅ @dnd-kit integration complete
- ✅ Mock data testing validated

**Completion Notes:**
- All objectives from FRONTEND_PLAN.md Phase 1 completed
- TypeScript strict mode compliance verified
- Accessibility and performance checks passed
- Ready for Backend Phase 1 to proceed

---

### **🟢 STAGE 2: Backend S3 Infrastructure** ✅ **COMPLETED**

#### **Step 2: Backend Agent - Phase 1** ✅ **COMPLETE**
**Agent:** Backend Developer Agent  
**Phase:** S3 Configuration API & Provider Abstraction  
**Dependencies:** ✅ Frontend Phase 1 Complete  
**Duration:** ~3-4 days  
**Status:** ✅ Complete (October 1, 2025)

**Prompt for Backend Agent:**
```
Backend Agent: Please implement Phase 1 from BACKEND_PLAN.md v1.0:
"S3 Configuration API & Provider Abstraction"

✅ CONTEXT: Frontend Phase 1 is complete. The Library UI with drag-and-drop,
file/folder cards, and navigation is ready for backend integration testing.

Focus on:
1. Create backend project structure with TypeScript (strict mode)
2. Implement S3 provider abstraction layer (AWS S3, Cloudflare R2, MinIO)
3. Build credential encryption system (at-rest security)
4. Create POST /api/storage/configure endpoint (with validation)
5. Create POST /api/storage/test endpoint (connection verification)
6. Implement GET /api/storage/status endpoint (current config status)
7. Implement configuration lock mechanism (prevent provider switching)

IMPORTANT:
- Use AWS SDK for JavaScript v3 (@aws-sdk/client-s3)
- Implement provider factory pattern for S3/R2/MinIO abstraction
- Test with actual S3/R2/MinIO test buckets
- Ensure secure credential storage (encrypted, no plaintext)
- Add comprehensive error handling and logging
- Create API documentation (OpenAPI/Swagger)

Reference: docs/plans/backend/BACKEND_PLAN.md (Lines 11-110)
```

**Deliverables:** ✅ **ALL COMPLETE**
- ✅ Working S3/R2/MinIO provider abstraction
- ✅ Secure credential storage with encryption (AES-256-GCM)
- ✅ Connection testing API endpoints (POST /api/storage/configure, POST /api/storage/test, GET /api/storage/status)
- ✅ Configuration lock mechanism operational
- ✅ API documentation complete (API_DOCUMENTATION.md, PHASE1_SUMMARY.md)
- ✅ Integration tests with test buckets passing
- ✅ 12 TypeScript files created with strict mode
- ✅ Zero security vulnerabilities

**Success Criteria:** ✅ **ALL MET**
- ✅ Connection test completes in <2 seconds (~1.8s achieved)
- ✅ Credentials encrypted at rest (no plaintext storage)
- ✅ Provider abstraction supports S3, R2, and MinIO
- ✅ Configuration lock prevents provider switching after initial setup
- ✅ Comprehensive error messages for troubleshooting
- ✅ TypeScript strict mode compliance
- ✅ Rate limiting implemented (100 req/15min)

**Completion Notes:**
- All objectives from BACKEND_PLAN.md Phase 1 completed
- Performance targets exceeded (connection test: 1.8s, encryption: 15ms)
- Ready for Frontend Phase 3 (Connections UI) integration
- API documentation available at backend/docs/API_DOCUMENTATION.md

---

### **🟢 STAGE 3: Connections UI Integration** ✅ **COMPLETED**

#### **Step 3: Frontend Agent - Phase 3** ✅ **COMPLETE**
**Agent:** Frontend Developer Agent  
**Phase:** Connections Page UI Implementation  
**Dependencies:** ✅ Backend Phase 1 Complete  
**Duration:** ~2 days  
**Status:** ✅ Complete (October 1, 2025)

**Wait Confirmation Required:**
```
Planner Agent: Confirm Backend Phase 1 completion before proceeding.

Required Backend Deliverables:
✅ POST /api/storage/configure endpoint working
✅ POST /api/storage/test endpoint working
✅ GET /api/storage/status endpoint working
✅ Provider abstraction tested with S3/R2/MinIO
```

**Prompt (AFTER Backend Phase 1 Complete):**
```
Frontend Agent: Please implement Phase 3 from FRONTEND_PLAN.md v1.2:
"Connections Page UI Implementation"

Backend API is ready. Focus on:
1. Create ConnectionsPage with provider selection
2. Implement S3 configuration form
3. Build connection testing UI with API integration
4. Add configuration lock warning system
5. Implement admin override modal
6. Test full connection workflow with backend

Use the following backend endpoints:
- POST /api/storage/configure
- POST /api/storage/test
- GET /api/storage/status

Reference: docs/plans/frontend/FRONTEND_PLAN.md (Lines 222-321)
```

**Deliverables:** ✅ **ALL COMPLETE**
- ✅ Connections Page fully functional
- ✅ S3 configuration form with validation
- ✅ Connection testing working with backend API
- ✅ Configuration lock UI operational
- ✅ Provider selection (S3, R2, MinIO) working
- ✅ Form validation and error handling complete
- ✅ Responsive design validated
- ✅ Integration with backend storage API verified

**Completion Notes:**
- All objectives from FRONTEND_PLAN.md Phase 3 completed
- TypeScript strict mode compliance verified
- Accessibility and UX standards met
- Ready for Backend Phase 2 to begin
- User can now configure MinIO connection via UI

---

### **🟢 STAGE 4: Backend File Operations** 🚀 **READY TO START**

#### **Step 4: Backend Agent - Phase 2** 🚀 **CLEARED FOR EXECUTION**
**Agent:** Backend Developer Agent  
**Phase:** S3 File Operations & Upload Coordination  
**Dependencies:** ✅ Backend Phase 1 Complete + ✅ Frontend Phase 3 Complete  
**Duration:** ~4-5 days  
**Status:** 🟢 Ready to Start - All dependencies met

**Wait Confirmation Required:**
```
Planner Agent: Confirm Frontend Phase 3 completion before proceeding.

Required Frontend Deliverables:
✅ Connections Page fully functional
✅ S3 configuration form integrated with backend
✅ Connection testing validated with MinIO
✅ Configuration lock mechanism working
```

**Context for Backend Agent (CRITICAL):**
```
✅ STAGE 1-3 COMPLETE:
- Frontend Phase 1: Library UI with drag-and-drop, file/folder cards, navigation (✅)
- Backend Phase 1: S3 configuration API, provider abstraction, credential encryption (✅)
- Frontend Phase 3: Connections Page UI fully functional and tested (✅)

👉 USER HAS CONFIGURED MinIO:
- MinIO bucket "research-space-library" created
- Versioning: ON, Object Locking: ON, Retention: Compliance (30 days)
- User will test connection via Connections Page UI
- Backend API endpoints validated: POST /api/storage/configure, POST /api/storage/test, GET /api/storage/status

🚨 YOUR MISSION:
Build the complete backend file operations infrastructure that will power the Library Page.
The frontend UI is ready and waiting for your APIs to enable real S3 operations.
```

**Prompt for Backend Agent:**
```
Backend Agent: Please implement Phase 2 from BACKEND_PLAN.md v1.0:
"S3 File Operations & Upload Coordination"

✅ CONTEXT: All prerequisites are complete!
- Backend Phase 1: S3 configuration API operational
- Frontend Phase 3: Connections UI fully functional
- User MinIO Setup: Bucket configured with versioning and object locking

Build on your Phase 1 infrastructure. Focus on:

1. **File Upload API** (Critical Priority)
   - POST /api/files/upload endpoint with multipart support
   - Upload progress tracking and resumption
   - File type and size validation
   - Integration with configured storage provider from Phase 1

2. **Presigned URL System** (High Priority)
   - POST /api/files/presigned-url (upload)
   - GET /api/files/:id/download (presigned download URLs)
   - URL expiration management (15 minutes default)
   - CORS handling for direct S3 access

3. **File Metadata CRUD** (High Priority)
   - File metadata database schema (file_id, name, size, type, s3_key, folder_id, created_at)
   - POST /api/files/metadata (create file record)
   - GET /api/files/:id/metadata (retrieve)
   - PUT /api/files/:id/metadata (update/rename)
   - DELETE /api/files/:id (soft delete + S3 deletion)
   - GET /api/files/list?folder_id=X&page=1&limit=50 (paginated listing)

4. **Folder Operations API** (High Priority)
   - Folder hierarchy database schema (folder_id, name, parent_id, path)
   - POST /api/folders (create folder)
   - PUT /api/folders/:id (rename)
   - DELETE /api/folders/:id (recursive deletion)
   - GET /api/folders/:id/contents (list files and subfolders)
   - GET /api/folders/breadcrumb/:id (path for navigation)

5. **Bulk Operations** (Medium Priority)
   - POST /api/files/bulk-delete (multiple file deletion)
   - POST /api/files/bulk-move (move files to folder)
   - POST /api/files/bulk-download (prepare zip or presigned URLs)
   - Operation queuing for large batches

6. **Upload Queue Management** (Medium Priority)
   - Upload status tracking (pending, uploading, complete, failed)
   - Failed upload retry mechanism
   - Concurrent upload limiting (5 max)
   - Upload cancellation support

IMPORTANT:
- Reuse StorageProvider abstraction from Phase 1
- Test with configured MinIO bucket (research-space-library)
- Ensure proper error handling for S3 failures
- Add comprehensive logging for debugging
- Create API documentation for Frontend integration
- Implement rate limiting (1000 req/15min per user)

Reference: docs/plans/backend/BACKEND_PLAN.md (Lines 118-225)
Phase 1 Code: backend/src/services/storageProvider.service.ts
Phase 1 Docs: backend/docs/API_DOCUMENTATION.md
```

**Deliverables:**
- ✅ File upload API with multipart support
- ✅ Presigned URL generation working
- ✅ File/folder metadata CRUD operational
- ✅ Bulk operations implemented
- ✅ Upload queue system functional

**Coordination Point:** Frontend Agent will need API documentation for Phase 5 integration

---

### **🟢 STAGE 5: Final Library Integration**

#### **Step 5: Frontend Agent - Phase 5**
**Agent:** Frontend Developer Agent  
**Phase:** Library Page S3 Integration & Export System  
**Dependencies:** ⚠️ **MUST WAIT** for Backend Phase 2 completion  
**Duration:** ~3-4 days  
**Status:** 🔴 Blocked until Backend Phase 2 ✅

**Wait Confirmation Required:**
```
Planner Agent: Confirm Backend Phase 2 completion before proceeding.

Required Backend Deliverables:
✅ POST /api/files/upload endpoint working
✅ POST /api/files/presigned-url endpoint working
✅ File metadata CRUD endpoints operational
✅ Folder operations API working
✅ Bulk operations tested and verified
```

**Prompt (AFTER Backend Phase 2 Complete):**
```
Frontend Agent: Please implement Phase 5 from FRONTEND_PLAN.md v1.2:
"Library Page S3 Integration & Export System"

All backend APIs are ready. Focus on:
1. Integrate Phase 1 UI with backend file operations
2. Implement real file upload with progress tracking
3. Connect drag-drop to actual S3 operations
4. Build file preview system with presigned URLs
5. Implement export and bulk download functionality
6. Add error recovery and offline queue

Use the following backend endpoints:
- POST /api/files/upload
- POST /api/files/presigned-url
- POST /api/files/metadata
- POST /api/folders
- POST /api/files/bulk-delete
- GET /api/files/list

Reference: docs/plans/frontend/FRONTEND_PLAN.md (Lines 431-542)
```

**Deliverables:**
- ✅ Complete Library S3 integration
- ✅ Real file upload/download working
- ✅ File preview system operational
- ✅ Export functionality complete
- ✅ Error recovery implemented

---

## 🔄 **Parallel Work Opportunities**

### **Parallel Window 1: Frontend Phase 1 + Backend Phase 1**
```
Timeline Day 1-4:
├─ Frontend Agent: Working on UI components (Phase 1)
└─ Backend Agent: Working on S3 configuration API (Phase 1)

Coordination: 
- Day 2: Backend shares API design with Frontend for review
- Day 4: Both phases complete independently
```

### **Parallel Window 2: Frontend Phase 3 + Backend Phase 2**
```
Timeline Day 5-8:
├─ Frontend Agent: Working on Connections UI (Phase 3)
└─ Backend Agent: Working on file operations API (Phase 2)

Coordination:
- Day 6: Backend shares file API design with Frontend
- Day 8: Backend Phase 2 completes
- Day 9: Frontend Phase 3 completes and validates Backend Phase 2
```

---

## ⚠️ **Critical Blocking Dependencies**

### **🔴 HARD BLOCKS (Cannot Proceed Until Resolved):**

1. **Frontend Phase 3 → Backend Phase 1**
   - Frontend CANNOT start Phase 3 until Backend Phase 1 is complete
   - Reason: Requires working API endpoints for configuration

2. **Frontend Phase 5 → Backend Phase 2**
   - Frontend CANNOT start Phase 5 until Backend Phase 2 is complete
   - Reason: Requires working file operation APIs

### **🟡 SOFT DEPENDENCIES (Can Start, But Need Coordination):**

1. **Backend Phase 1 → Frontend Phase 1**
   - Backend can start Phase 1 during Frontend Phase 1
   - Coordination: Backend should review Frontend UI at ~50% for API design validation

2. **Backend Phase 2 → Frontend Phase 3**
   - Backend can start Phase 2 when Frontend Phase 3 is ~50% complete
   - Coordination: Backend should provide API documentation for Frontend Phase 5

---

## 📊 **Execution Timeline (Estimated)**

```
✅ COMPLETED STAGES:
└─ Week 1 (Days 1-6): All 3 stages complete
   ├─ Day 1-3: Frontend Phase 1 (UI Components) ✅
   ├─ Day 2-5: Backend Phase 1 (S3 Config API) ✅ [Parallel]
   └─ Day 6: Frontend Phase 3 (Connections UI) ✅

🟢 ACTIVE STAGE:
├─ Week 2 (Days 7-11): Backend Phase 2 (File Operations) 🚀 STARTING
└─ Duration: 4-5 days

🔴 REMAINING STAGE:
└─ Week 2-3 (Days 12-15): Frontend Phase 5 (S3 Integration)
   └─ Blocked until Backend Phase 2 complete

Total Duration: ~15 days (with parallel work)
Sequential Duration: ~20 days (without parallel work)
Time Saved: ~5 days through parallel execution
Progress: 60% Complete (3/5 phases done)
```

---

## 🎯 **Execution Checklist**

### **Before Starting Any Phase:**
- [ ] Read the complete phase description in PLAN file
- [ ] Verify all dependencies are satisfied
- [ ] Check for blocking dependencies
- [ ] Review coordination points with other agents
- [ ] Confirm test environment is ready

### **During Phase Execution:**
- [ ] Update phase status in PLAN file (🔴 → 🟡)
- [ ] Mark completed tasks with checkboxes
- [ ] Document any blockers or issues
- [ ] Coordinate with dependent agents
- [ ] Test deliverables incrementally

### **After Phase Completion:**
- [ ] Update phase status in PLAN file (🟡 → ✅)
- [ ] Verify all objectives are met
- [ ] Run complete testing strategy
- [ ] Document any deviations or changes
- [ ] Notify dependent agents of completion

---

## 🔔 **Agent Notification Protocol**

### **When to Notify Other Agents:**

1. **Backend Phase 1 → 50% Complete**
   - Notify Frontend Agent: API design ready for review
   - Share: Endpoint specifications and sample responses

2. **Backend Phase 1 → 100% Complete**
   - Notify Frontend Agent: Ready to start Phase 3
   - Share: Complete API documentation and test credentials

3. **Frontend Phase 3 → 50% Complete**
   - Notify Backend Agent: Can start Phase 2
   - Share: Connection testing feedback and edge cases

4. **Backend Phase 2 → 50% Complete**
   - Notify Frontend Agent: API design ready for Phase 5
   - Share: File operation endpoint specifications

5. **Backend Phase 2 → 100% Complete**
   - Notify Frontend Agent: Ready to start Phase 5
   - Share: Complete file operation API documentation

---

## 🚀 **Recommended Starting Command**

### **Step 1: Start Frontend Phase 1 Immediately**
```bash
# In your terminal prompt the Frontend Agent:
"Frontend Agent: Please implement Phase 1 from FRONTEND_PLAN.md v1.2 - 
Library Page Advanced UI Components. Use mock data for testing."
```

### **Step 2: Start Backend Phase 1 (1-2 days later)**
```bash
# After Frontend Phase 1 is ~50% complete, prompt Backend Agent:
"Backend Agent: Please implement Phase 1 from BACKEND_PLAN.md v1.0 - 
S3 Configuration API & Provider Abstraction. Coordinate with Frontend for API design validation."
```

---

## 📝 **Quick Reference Table**

| Step | Agent | Phase | Can Start After | Duration | Status | Blocks |
|------|-------|-------|----------------|----------|--------|--------|
| 1 | Frontend | Phase 1 | Immediate | 2-3 days | ✅ Complete | None |
| 2 | Backend | Phase 1 | Step 1 Complete | 3-4 days | ✅ Complete | Frontend Phase 3 |
| 3 | Frontend | Phase 3 | Step 2 Complete | 2 days | ✅ Complete | None |
| 4 | Backend | Phase 2 | Now (Steps 2&3 Complete) | 4-5 days | 🟢 Ready | Frontend Phase 5 |
| 5 | Frontend | Phase 5 | Step 4 Complete | 3-4 days | 🔴 Blocked | None |

**Total Estimated Time:** 15 days (with optimal parallelization)  
**Current Progress:** 60% Complete (3/5 phases)  
**Next Action:** Start Backend Agent Phase 2

---

## ✅ **Success Indicators**

### **Phase Completion Validation:**
- All checkboxes in phase objectives marked ✅
- All files created/modified as specified
- Testing strategy executed successfully
- Performance metrics met
- Code quality checks passed
- Cross-browser compatibility verified (Frontend)
- Integration tests passing (Backend)

### **Project Completion:**
- ✅ Google Drive-like Library UI functional
- ✅ S3/R2/MinIO integration working
- ✅ File upload/download operational
- ✅ Export functionality complete
- ✅ Configuration lock mechanism active
- ✅ All security requirements met

---

**Document Status:** 🟢 Active Execution - Stage 4  
**Current Phase:** Backend Phase 2 (File Operations API)  
**Last Completed:** Frontend Phase 3 (October 1, 2025)  
**Next Action:** Start Backend Agent Phase 2 immediately  
**Progress:** 60% Complete (3/5 phases done)  
**MinIO Status:** Configured and ready for testing  
**Backend API Ready:** http://localhost:3001 (docs: backend/docs/API_DOCUMENTATION.md)  
**Coordination:** Planner Agent standing by for Backend Phase 2 execution
