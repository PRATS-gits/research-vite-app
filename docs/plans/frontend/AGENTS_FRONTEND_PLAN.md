# Research Space - Agents Page Implementation Plan

> **Created:** October 5, 2025
> **Last Updated:** October 5, 2025
> **Status:** 🔴 Planning
> **Priority:** ⚡ High
> **Domain Lead:** Frontend Agent & Backend Agent (Collaborative)
> **Tracking:** 0/7 Phases Complete

---

## Development Phases

### **Phase 1: Foundation Setup & Model Provider Icons (Frontend)**
**Target:** Install icon libraries and establish Agent data structures
**Status:** 🔴 Planning
**Priority:** 🚨 Critical
**Lead:** Frontend Agent

#### **Technical Assessment:**
- **Current Issues:** No Agent infrastructure exists; Model provider icons unavailable
- **Performance Impact:** Establishes foundation for all Agent features
- **Risk Level:** Low
- **Dependencies:** None (starting foundation)

#### **Objectives:**
- [ ] Install and configure @lobehub/icons package for AI model provider logos
- [ ] Install simple-icons as fallback for additional brand logos
- [ ] Create AgentStore Zustand store mirroring uploadQueueStore structure
- [ ] Create TypeScript types for Agent entities (Agent, AgentTask, AgentConfig)
- [ ] Set up placeholder AgentsPage structure reusing Library layout patterns

#### **Scope:**
- **Included:** Icon package installation, Zustand store creation, TypeScript types, basic page structure
- **Excluded:** Backend API integration, n8n webhook implementation, actual Agent functionality
- **Boundaries:** Frontend data structures and visual dependencies only
- **Success Metrics:** All icon packages installed; AgentStore created; Types defined; Page renders

#### **Technical Tasks:**

1. **Install Model Provider Icon Libraries**
   - [ ] Install @lobehub/icons: `npm install @lobehub/icons` (supports OpenAI, Google, DeepSeek)
   - [ ] Install simple-icons: `npm install simple-icons` (fallback for additional providers)
   - [ ] Install react-layout-kit if needed: `npm install react-layout-kit` (for icon layout components)
   - [ ] Test icon imports: Create test component rendering OpenAI, Google, DeepSeek icons
   - [ ] Document icon usage patterns in component comments

2. **Create TypeScript Type Definitions**
   - [ ] Create `src/types/agent.ts` with Agent, AgentConfig, AgentTask interfaces
   - [ ] Define ModelProvider type union: OpenAI | Google | DeepSeek variants
   - [ ] Define AgentMode type: 'single' | 'bulk'
   - [ ] Define AgentTaskStatus type: 'pending' | 'processing' | 'completed' | 'failed'
   - [ ] Define AgentEndpointStatus type: 'reachable' | 'unreachable' | 'checking'

3. **Create AgentStore Zustand Store**
   - [ ] Create `src/store/agentStore.ts` mirroring uploadQueueStore.ts structure
   - [ ] Implement agents list state: Agent[]
   - [ ] Implement taskQueue state: AgentTask[]
   - [ ] Implement actions: addAgent, updateAgent, deleteAgent, addTask, updateTaskProgress
   - [ ] Implement endpoint health check state and actions
   - [ ] Add localStorage persistence for agent configurations

4. **Create AgentTaskQueueStore**
   - [ ] Create `src/store/agentTaskQueueStore.ts` separate from AgentStore
   - [ ] Mirror uploadQueueStore structure: queue, isProcessing, totalProgress
   - [ ] Implement actions: addToQueue, updateProgress, removeFromQueue, clearCompleted
   - [ ] Add notification integration for task completion (sonner toast)

5. **Setup Base AgentsPage Structure**
   - [ ] Update `src/pages/AgentsPage.tsx` to match LibraryPage layout pattern
   - [ ] Add page header with title "Research Agents" and description
   - [ ] Add placeholder for Agent controls (Create button positioned top-right)
   - [ ] Add placeholder grid container for Agent Cards (2-column layout)
   - [ ] Ensure responsive behavior matching Library Page patterns

#### **Files to Modify/Create:**
- `package.json` (Add @lobehub/icons, simple-icons, react-layout-kit) [Status: ❌]
- `src/types/agent.ts` (Create complete Agent type definitions) [Status: ❌]
- `src/store/agentStore.ts` (Create Zustand store for Agent management) [Status: ❌]
- `src/store/agentTaskQueueStore.ts` (Create task queue store) [Status: ❌]
- `src/pages/AgentsPage.tsx` (Update with proper structure) [Status: ❌]
- `src/components/agents/` (Create directory for Agent components) [Status: ❌]

#### **Performance Metrics:**
- **Before:** No Agent infrastructure exists
- **Target:** All icon packages functional; Stores created; Types defined; 0 TypeScript errors
- **Measurement Tools:** TypeScript compiler, npm list, React DevTools

#### **Testing Strategy:**
- [ ] Verify @lobehub/icons renders OpenAI.Color, Google.Color, DeepSeek.Color correctly
- [ ] Verify AgentStore actions work: addAgent, updateAgent, deleteAgent
- [ ] Verify AgentTaskQueueStore matches uploadQueueStore behavior patterns
- [ ] Test localStorage persistence for agent configurations
- [ ] Verify AgentsPage renders without errors

#### **Code Quality Checks:**
- [ ] All TypeScript types strictly typed (no 'any' types)
- [ ] Zustand stores follow existing store patterns (libraryStore, uploadQueueStore)
- [ ] Icon imports use named imports from @lobehub/icons
- [ ] ESLint passes with zero warnings
- [ ] Code follows CODING_STANDARDS.md conventions

---

### **Phase 2: Backend Agent API Endpoints (Backend)**
**Target:** Create REST API endpoints for Agent CRUD and n8n webhook receiver
**Status:** 🔴 Planning
**Priority:** 🚨 Critical
**Lead:** Backend Agent

#### **Technical Assessment:**
- **Current Issues:** No backend Agent API exists; n8n webhook receiver endpoint missing
- **Performance Impact:** Enables Agent configuration persistence and n8n integration
- **Risk Level:** Medium (CORS configuration for n8n Railway instance)
- **Dependencies:** Phase 1 (Frontend types establish API contract)

#### **Objectives:**
- [ ] Create Prisma Agent model with name, endpoint, webhook URL, status fields
- [ ] Implement GET /api/agents endpoint (list all agents with pagination)
- [ ] Implement POST /api/agents endpoint (create new agent configuration)
- [ ] Implement PUT /api/agents/:id endpoint (update agent configuration)
- [ ] Implement DELETE /api/agents/:id endpoint (soft delete agent)
- [ ] Implement POST /api/agents/:id/health-check endpoint (verify n8n endpoint reachability)
- [ ] Implement POST /api/agents/webhook/receive endpoint (n8n file upload handler with CORS whitelist)

#### **Scope:**
- **Included:** Prisma schema, CRUD endpoints, health check, webhook receiver with CORS
- **Excluded:** n8n workflow creation, frontend integration, file processing logic
- **Boundaries:** Backend API layer only; Agent task execution happens in n8n
- **Success Metrics:** All endpoints functional; CORS allows Railway n8n; Prisma migrations successful

#### **Technical Tasks:**

1. **Create Prisma Agent Model**
   - [ ] Add Agent model to `backend/prisma/schema.prisma`
   - [ ] Fields: id (uuid), name (String), description (String?), webhookUrl (String), isActive (Boolean), endpointStatus (String), createdAt, updatedAt, deletedAt?
   - [ ] Add indexes on isActive, deletedAt, createdAt
   - [ ] Run `npx prisma migrate dev --name add-agent-model`
   - [ ] Run `npx prisma generate` to update Prisma Client

2. **Create Agent Routes & Controller**
   - [ ] Create `backend/src/routes/agents.routes.ts`
   - [ ] Create `backend/src/controllers/AgentsController.ts`
   - [ ] Implement GET /api/agents with pagination (page, limit query params)
   - [ ] Implement POST /api/agents with Joi validation (name, webhookUrl required)
   - [ ] Implement PUT /api/agents/:id with partial update support
   - [ ] Implement DELETE /api/agents/:id with soft delete (set deletedAt)
   - [ ] Add route registration in `backend/src/server.ts`

3. **Implement Health Check Endpoint**
   - [ ] Create POST /api/agents/:id/health-check endpoint
   - [ ] Make HTTP HEAD request to agent webhookUrl with 5s timeout
   - [ ] Return { reachable: boolean, latency: number, lastChecked: timestamp }
   - [ ] Update agent endpointStatus in database (reachable/unreachable)
   - [ ] Add error handling for network failures, timeouts, DNS errors

4. **Create n8n Webhook Receiver Endpoint**
   - [ ] Create POST /api/agents/webhook/receive endpoint
   - [ ] Configure CORS middleware to whitelist Railway n8n instance
   - [ ] Accept multipart/form-data with file upload and metadata (agentId, taskId, outputPath)
   - [ ] Validate presigned URL for output path exists in S3
   - [ ] Upload received file to S3 at specified outputPath using StorageProviderService
   - [ ] Return { success: true, fileUrl: string, savedPath: string }
   - [ ] Add rate limiting exception for n8n IP/domain

5. **Configure CORS for n8n Webhook**
   - [ ] Update `backend/src/middleware/cors.ts` or create agent-specific CORS
   - [ ] Whitelist Railway n8n instance: allow http://, https://, and IP addresses
   - [ ] Allow OPTIONS preflight requests for webhook endpoint
   - [ ] Set allowed methods: POST, OPTIONS
   - [ ] Set allowed headers: Content-Type, Authorization, X-Agent-Key
   - [ ] Add environment variables: N8N_WEBHOOK_ORIGIN (Railway URL)

6. **Create Agent Service Layer**
   - [ ] Create `backend/src/services/AgentService.ts`
   - [ ] Implement createAgent(), updateAgent(), deleteAgent(), getAgents()
   - [ ] Implement checkAgentHealth() with HTTP request to webhook URL
   - [ ] Add business logic for agent validation (webhook URL format, uniqueness)
   - [ ] Add error handling for Prisma operations

#### **Files to Modify/Create:**
- `backend/prisma/schema.prisma` (Add Agent model) [Status: ❌]
- `backend/src/routes/agents.routes.ts` (Create Agent routes) [Status: ❌]
- `backend/src/controllers/AgentsController.ts` (Create controller) [Status: ❌]
- `backend/src/services/AgentService.ts` (Create service layer) [Status: ❌]
- `backend/src/middleware/cors.ts` (Update CORS for n8n webhook) [Status: ❌]
- `backend/src/server.ts` (Register Agent routes) [Status: ❌]
- `backend/.env.example` (Add N8N_WEBHOOK_ORIGIN variable) [Status: ❌]

#### **Performance Metrics:**
- **Before:** No Agent API endpoints exist
- **Target:** 7 endpoints functional; CORS configured; <200ms response time for CRUD
- **Measurement Tools:** Postman/Insomnia, backend logs, Prisma Studio

#### **Testing Strategy:**
- [ ] Test all CRUD endpoints with valid/invalid data (Postman collection)
- [ ] Test health check endpoint returns correct reachability status
- [ ] Test webhook receiver accepts multipart/form-data from n8n
- [ ] Test CORS allows Railway n8n instance but blocks unauthorized origins
- [ ] Test rate limiting doesn't block n8n webhook calls
- [ ] Test soft delete functionality (agents not actually deleted)
- [ ] Verify Prisma migrations run successfully

#### **Code Quality Checks:**
- [ ] All endpoints follow existing backend patterns (FilesController, StorageController)
- [ ] Joi validation schemas defined for all POST/PUT requests
- [ ] Error responses follow standard format: { success: false, message, timestamp }
- [ ] TypeScript types for Agent model match frontend types from Phase 1
- [ ] Winston logging added for all Agent operations
- [ ] ESLint backend passes with zero warnings

---

### **Phase 3: Agent Card Component & Grid Layout (Frontend)**
**Target:** Create AgentCard component with status indicator and Configure/Assign buttons
**Status:** 🔴 Planning
**Priority:** ⚡ High
**Lead:** Frontend Agent

#### **Technical Assessment:**
- **Current Issues:** No Agent visualization components exist
- **Performance Impact:** Enables Agent browsing and selection
- **Risk Level:** Low
- **Dependencies:** Phase 1 (AgentStore, types), Phase 2 (Backend API for data)

#### **Objectives:**
- [ ] Create AgentCard component reusing FolderCard design patterns
- [ ] Add status indicator (green/red dot) for endpoint reachability
- [ ] Add Configure button (bottom-right) and Assign Task button (bottom-left)
- [ ] Create AgentGrid component with 2-column responsive layout
- [ ] Integrate with AgentStore to display agent list
- [ ] Add loading states and empty state UI

#### **Scope:**
- **Included:** AgentCard, AgentGrid, status indicators, button placeholders, API integration
- **Excluded:** Modal functionality (Phase 4), task assignment logic, n8n integration
- **Boundaries:** Display and navigation only; actual Agent operations in later phases
- **Success Metrics:** Agent Cards render in 2-column grid; Status indicators functional

#### **Technical Tasks:**

1. **Create AgentCard Component**
   - [ ] Create `src/components/agents/AgentCard.tsx` based on FolderCard.tsx structure
   - [ ] Add agent name, description, webhook URL (truncated) display
   - [ ] Add status indicator: green dot (reachable), red dot (unreachable), gray dot (checking)
   - [ ] Add Configure button (bottom-right): icon + "Configure" text
   - [ ] Add Assign Task button (bottom-left): icon + "Assign Task" text
   - [ ] Add hover effects matching FolderCard (border, shadow, scale)
   - [ ] Use Shadcn Card, Badge, Button components

2. **Implement Status Indicator Logic**
   - [ ] Fetch agent.endpointStatus from AgentStore
   - [ ] Render status dot: green (#10b981), red (#ef4444), gray (#6b7280)
   - [ ] Add tooltip showing last health check timestamp
   - [ ] Position status dot: top-right corner of AgentCard
   - [ ] Add pulsing animation for "checking" status

3. **Create AgentGrid Component**
   - [ ] Create `src/components/agents/AgentGrid.tsx` 
   - [ ] Use CSS Grid: `grid-cols-1 md:grid-cols-2 gap-6` (2 columns on desktop)
   - [ ] Map over agents from AgentStore: agents.map(agent => <AgentCard />)
   - [ ] Add loading skeleton (6 cards) using Shadcn Skeleton component
   - [ ] Add empty state: "No agents configured. Create your first agent!" with illustration

4. **Create Agent Controls Bar**
   - [ ] Create `src/components/agents/AgentControls.tsx`
   - [ ] Add Create Agent button (positioned top-right, primary variant)
   - [ ] Add Search bar (positioned top-left, similar to LibrarySearchBar)
   - [ ] Add Filter dropdown placeholder (future feature)
   - [ ] Match styling with LibraryControls.tsx patterns

5. **Integrate AgentsPage with Components**
   - [ ] Import AgentGrid, AgentControls into AgentsPage.tsx
   - [ ] Fetch agents from backend on mount: useEffect(() => fetchAgents(), [])
   - [ ] Connect to AgentStore: const { agents, setAgents } = useAgentStore()
   - [ ] Add error handling for API failures (toast notification)
   - [ ] Add refresh functionality (manual or polling every 30s for health status)

6. **Implement Health Check Polling**
   - [ ] Create useAgentHealthCheck custom hook
   - [ ] Poll /api/agents/:id/health-check every 60 seconds per agent
   - [ ] Update AgentStore with latest endpointStatus
   - [ ] Add manual "Check Now" button on AgentCard for immediate health check
   - [ ] Debounce health check requests to prevent API spam

#### **Files to Modify/Create:**
- `src/components/agents/AgentCard.tsx` (Create Agent card component) [Status: ❌]
- `src/components/agents/AgentGrid.tsx` (Create grid layout component) [Status: ❌]
- `src/components/agents/AgentControls.tsx` (Create controls bar) [Status: ❌]
- `src/hooks/useAgentHealthCheck.ts` (Create health check polling hook) [Status: ❌]
- `src/pages/AgentsPage.tsx` (Integrate all components) [Status: ❌]
- `src/api/agentsApi.ts` (Create API client for Agent endpoints) [Status: ❌]

#### **Performance Metrics:**
- **Before:** No Agent visualization exists
- **Target:** Agents render in <500ms; Health checks poll every 60s; 2-column responsive grid
- **Measurement Tools:** React DevTools Profiler, Chrome Performance tab

#### **Testing Strategy:**
- [ ] Verify AgentCard renders with all data fields correctly
- [ ] Verify status indicator colors match endpoint status
- [ ] Verify 2-column grid layout responsive on mobile (1 column), tablet (2 columns)
- [ ] Test health check polling updates status indicator in real-time
- [ ] Test loading skeleton shows while fetching agents
- [ ] Test empty state displays when no agents exist
- [ ] Test error toast shows on API failure

#### **Code Quality Checks:**
- [ ] AgentCard follows FolderCard component patterns
- [ ] All components use Shadcn UI primitives (Card, Badge, Button, Skeleton)
- [ ] TypeScript props interfaces strictly typed
- [ ] React.memo used for AgentCard to prevent unnecessary re-renders
- [ ] Custom hooks follow existing patterns (useLibraryNavigation, useMultiSelect)
- [ ] ESLint passes with zero warnings

---

### **Phase 4: Configure Modal & Agent CRUD (Frontend)**
**Target:** Implement Configure modal for Agent editing and deletion
**Status:** 🔴 Planning
**Priority:** ⚡ High
**Lead:** Frontend Agent

#### **Technical Assessment:**
- **Current Issues:** No Agent configuration UI exists
- **Performance Impact:** Enables Agent management (edit, delete)
- **Risk Level:** Low
- **Dependencies:** Phase 2 (Backend CRUD APIs), Phase 3 (AgentCard with Configure button)

#### **Objectives:**
- [ ] Create ConfigureAgentModal with global route /agents/configure/:id
- [ ] Display agent name, description, webhook URL in read-only mode initially
- [ ] Add Edit mode toggle to make fields editable
- [ ] Add Save button to update agent via PUT /api/agents/:id
- [ ] Add Delete button with confirmation dialog
- [ ] Integrate with useModalRouting hook for URL-based modal state

#### **Scope:**
- **Included:** Configure modal, Edit/Save functionality, Delete with confirmation, API integration
- **Excluded:** Create Agent modal (Phase 5), Task assignment, n8n workflow management
- **Boundaries:** Agent CRUD operations only; no task execution logic
- **Success Metrics:** Configure modal functional; Edit/Delete operations work; Data persists

#### **Technical Tasks:**

1. **Create ConfigureAgentModal Component**
   - [ ] Create `src/components/agents/ConfigureAgentModal.tsx`
   - [ ] Use Shadcn Dialog component with global route /agents/configure/:id
   - [ ] Integrate useModalRouting hook from existing modal patterns
   - [ ] Fetch agent data by ID from AgentStore or API on modal open
   - [ ] Display fields: Name, Description, Webhook URL, Created Date, Status
   - [ ] Add loading state while fetching agent details

2. **Implement Read-Only View**
   - [ ] Display agent data in read-only format using Shadcn Label + Text
   - [ ] Show webhook URL with copy-to-clipboard button
   - [ ] Show current endpoint status with colored Badge
   - [ ] Show last health check timestamp
   - [ ] Add "Edit" button (top-right) to toggle edit mode

3. **Implement Edit Mode**
   - [ ] Add isEditMode state: const [isEditMode, setIsEditMode] = useState(false)
   - [ ] Convert labels to Input/Textarea components when isEditMode = true
   - [ ] Use React Hook Form for form state management
   - [ ] Add validation: name required, webhookUrl must be valid URL format
   - [ ] Show Save/Cancel buttons when in edit mode

4. **Implement Save Functionality**
   - [ ] Call PUT /api/agents/:id with updated data on Save button click
   - [ ] Update AgentStore with new data: updateAgent(agentId, updatedData)
   - [ ] Show success toast: "Agent updated successfully"
   - [ ] Exit edit mode and refresh agent list
   - [ ] Handle API errors with error toast

5. **Implement Delete Functionality**
   - [ ] Add Delete button (bottom-left, destructive variant)
   - [ ] Show confirmation dialog: "Are you sure you want to delete this agent? This cannot be undone."
   - [ ] Call DELETE /api/agents/:id on confirmation
   - [ ] Remove agent from AgentStore: deleteAgent(agentId)
   - [ ] Close modal and show success toast: "Agent deleted successfully"
   - [ ] Refresh agent list on AgentsPage

6. **Add Manual Health Check Button**
   - [ ] Add "Check Health" button in Configure modal
   - [ ] Call POST /api/agents/:id/health-check on click
   - [ ] Show loading spinner while checking
   - [ ] Update status indicator with result
   - [ ] Show toast with health check result and latency

#### **Files to Modify/Create:**
- `src/components/agents/ConfigureAgentModal.tsx` (Create configure modal) [Status: ❌]
- `src/components/agents/DeleteAgentDialog.tsx` (Create delete confirmation) [Status: ❌]
- `src/api/agentsApi.ts` (Add updateAgent, deleteAgent, healthCheck functions) [Status: ❌]
- `src/hooks/useModalRouting.ts` (Verify compatibility with agent routes) [Status: 🔄]
- `src/store/agentStore.ts` (Add updateAgent, deleteAgent actions) [Status: 🔄]
- `src/pages/AgentsPage.tsx` (Add route for configure modal) [Status: 🔄]

#### **Performance Metrics:**
- **Before:** No Agent configuration UI exists
- **Target:** Modal opens in <200ms; Save/Delete operations complete in <500ms
- **Measurement Tools:** React DevTools, Chrome Network tab

#### **Testing Strategy:**
- [ ] Test Configure modal opens with correct agent data
- [ ] Test Edit mode enables form fields correctly
- [ ] Test Save button updates agent and persists to backend
- [ ] Test Delete button shows confirmation and removes agent
- [ ] Test validation errors display for invalid webhook URL
- [ ] Test Cancel button discards changes and exits edit mode
- [ ] Test modal closes and navigates back to /agents route

#### **Code Quality Checks:**
- [ ] Modal follows existing modal patterns (CreateFolderModal, RenameModal)
- [ ] React Hook Form used for form state and validation
- [ ] Zod or Joi schema for client-side validation
- [ ] Delete confirmation uses Shadcn AlertDialog component
- [ ] TypeScript interfaces for form data strictly typed
- [ ] ESLint passes with zero warnings

---

### **Phase 5: Create Agent Modal & Model Selection (Frontend)**
**Target:** Implement Create Agent modal with model selection dropdown and provider icons
**Status:** 🔴 Planning
**Priority:** ⚡ High
**Lead:** Frontend Agent

#### **Technical Assessment:**
- **Current Issues:** No Agent creation UI exists; Model provider icons not implemented
- **Performance Impact:** Enables Agent onboarding workflow
- **Risk Level:** Low
- **Dependencies:** Phase 1 (@lobehub/icons installed), Phase 2 (POST /api/agents endpoint)

#### **Objectives:**
- [ ] Create CreateAgentModal accessible from Create button on AgentsPage
- [ ] Add form fields: Agent Name, Description, Webhook URL
- [ ] Research and implement Model Selection dropdown with provider logos
- [ ] Integrate OpenAI, Google, DeepSeek icons from @lobehub/icons
- [ ] Add validation and submit to POST /api/agents endpoint
- [ ] Add agent to AgentStore after successful creation

#### **Scope:**
- **Included:** Create modal, form validation, model dropdown, provider icons, API integration
- **Excluded:** n8n workflow setup, task assignment, file processing
- **Boundaries:** Agent configuration only; workflow logic in n8n
- **Success Metrics:** Create modal functional; Model selection works; Icons display correctly

#### **Technical Tasks:**

1. **Research Model Provider Icon Implementation**
   - [ ] Review @lobehub/icons documentation for OpenAI, Google, DeepSeek usage
   - [ ] Test rendering OpenAI.Color, Google.Color, DeepSeek.Color with size prop
   - [ ] Research simple-icons for additional providers if @lobehub/icons insufficient
   - [ ] Create icon mapping object: MODEL_PROVIDER_ICONS = { 'openai/gpt-4.1': <OpenAI.Color /> }
   - [ ] Document icon usage patterns for future maintenance

2. **Create CreateAgentModal Component**
   - [ ] Create `src/components/agents/CreateAgentModal.tsx`
   - [ ] Use Shadcn Dialog component with trigger from AgentControls Create button
   - [ ] Add form fields: Agent Name (required), Description (optional), Webhook URL (required)
   - [ ] Use React Hook Form for form state management
   - [ ] Add Zod validation schema: name min 3 chars, webhookUrl valid URL format
   - [ ] Add loading state during submission

3. **Implement Model Selection Dropdown**
   - [ ] Create ModelSelectionDropdown component using Shadcn Popover + Command
   - [ ] Define model options array with provider icons:
     ```typescript
     const MODEL_OPTIONS = [
       { value: 'auto', label: 'Auto (GPT-4.1)', provider: 'openai', icon: OpenAI },
       { value: 'openai/gpt-4.1', label: 'GPT-4.1', provider: 'openai', icon: OpenAI },
       { value: 'openai/gpt-4.1-mini', label: 'GPT-4.1 Mini', provider: 'openai', icon: OpenAI },
       { value: 'openai/gpt-5', label: 'GPT-5', provider: 'openai', icon: OpenAI },
       { value: 'openai/gpt-5-mini', label: 'GPT-5 Mini', provider: 'openai', icon: OpenAI },
       { value: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash', provider: 'google', icon: Google },
       { value: 'google/gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite', provider: 'google', icon: Google },
       { value: 'deepseek/deepseek-chat-v3-0324', label: 'DeepSeek V3 0324', provider: 'deepseek', icon: DeepSeek },
       { value: 'deepseek/deepseek-chat-v3.1', label: 'DeepSeek V3.1', provider: 'deepseek', icon: DeepSeek }
     ]
     ```
   - [ ] Render each option with provider icon (24px) + model label
   - [ ] Add search/filter functionality in dropdown
   - [ ] Set default value to 'auto'

4. **Integrate Provider Icons**
   - [ ] Import from @lobehub/icons: `import { OpenAI, Google, DeepSeek } from '@lobehub/icons'`
   - [ ] Render icons in dropdown: `<OpenAI.Color size={24} />` for OpenAI models
   - [ ] Render icons in selected value display: Show icon + label when model selected
   - [ ] Add fallback icon for unknown providers (generic AI icon from lucide-react)
   - [ ] Test dark/light theme compatibility with colored icons

5. **Implement Form Submission**
   - [ ] Call POST /api/agents with form data on submit
   - [ ] Include model selection in agent configuration (store as JSON field)
   - [ ] Add agent to AgentStore: addAgent(newAgent)
   - [ ] Close modal and show success toast: "Agent created successfully"
   - [ ] Refresh agent list on AgentsPage
   - [ ] Handle API errors with error toast and form validation errors

6. **Add Icon Package Fallback Logic**
   - [ ] If @lobehub/icons fails for specific provider, use simple-icons
   - [ ] Create IconResolver utility: `getProviderIcon(provider: string): ReactNode`
   - [ ] Add error boundary for icon rendering failures
   - [ ] Log icon resolution failures for debugging
   - [ ] Document icon fallback strategy in component comments

#### **Files to Modify/Create:**
- `src/components/agents/CreateAgentModal.tsx` (Create agent creation modal) [Status: ❌]
- `src/components/agents/ModelSelectionDropdown.tsx` (Create model dropdown) [Status: ❌]
- `src/components/agents/ModelProviderIcon.tsx` (Create icon resolver component) [Status: ❌]
- `src/utils/modelProviderIcons.ts` (Create icon mapping utility) [Status: ❌]
- `src/api/agentsApi.ts` (Add createAgent function) [Status: 🔄]
- `src/store/agentStore.ts` (Add addAgent action) [Status: 🔄]

#### **Performance Metrics:**
- **Before:** No Agent creation UI exists
- **Target:** Modal opens in <200ms; Icons render without flicker; Form submits in <500ms
- **Measurement Tools:** React DevTools, Chrome Network tab, Lighthouse

#### **Testing Strategy:**
- [ ] Test Create button opens CreateAgentModal
- [ ] Test all form fields validate correctly (required, URL format)
- [ ] Test Model Selection dropdown displays all models with correct icons
- [ ] Test OpenAI, Google, DeepSeek icons render in both light and dark themes
- [ ] Test form submission creates agent and updates AgentStore
- [ ] Test error handling for API failures
- [ ] Test icon fallback logic when @lobehub/icons unavailable

#### **Code Quality Checks:**
- [ ] Modal follows CreateFolderModal component patterns
- [ ] Model dropdown uses Shadcn Command component for search
- [ ] Zod schema for form validation matches backend Joi schema
- [ ] Icon components properly typed with React.ComponentType
- [ ] All model codes match OpenRouter API format exactly
- [ ] ESLint passes with zero warnings

---

### **Phase 6: Assign Task Modal & Library Integration (Frontend)**
**Target:** Implement Assign Task modal with file selection from Library and output path
**Status:** 🔴 Planning
**Priority:** ⚡ High
**Lead:** Frontend Agent

#### **Technical Assessment:**
- **Current Issues:** No task assignment UI; Library integration for file selection missing; Move To modal has abrupt closing bug
- **Performance Impact:** Enables Agent task execution workflow
- **Risk Level:** Medium (complex Library component reuse, MoveToModal bug fix required)
- **Dependencies:** Phase 3 (AgentCard), Phase 5 (Model selection), Library Page components

#### **Objectives:**
- [ ] Fix MoveToModal abrupt closing bug before reusing for output path selection
- [ ] Create AssignTaskModal with global route /agents/assign/:id
- [ ] Add Mode switch (Single/Bulk) for file attachment limits
- [ ] Reuse Model Selection dropdown from Phase 5
- [ ] Create Add File modal reusing Library Grid components for file selection
- [ ] Create Output Path selector reusing fixed MoveToModal patterns with inline Create Folder
- [ ] Add Custom Instruction textarea (optional)
- [ ] Implement Send button to submit task to n8n webhook

#### **Scope:**
- **Included:** Assign Task modal, Mode switch, Add File integration, Output Path selector, n8n payload construction
- **Excluded:** n8n workflow execution, file processing, progress tracking (Phase 7)
- **Boundaries:** Frontend task submission only; n8n handles execution
- **Success Metrics:** Modal functional; File selection works; Output path selectable; Task submitted to n8n

#### **Technical Tasks:**

1. **Fix MoveToModal Abrupt Closing Bug**
   - [ ] Review `src/components/library/MoveToModal.tsx` for state management issues
   - [ ] Identify cause of abrupt closing (likely onClick outside or state reset)
   - [ ] Fix by adding proper event handlers for modal persistence
   - [ ] Add preventDefaultClose prop or stopPropagation on folder navigation clicks
   - [ ] Test modal stays open during folder navigation and file selection
   - [ ] Document fix in BUGFIX_MOVETMODAL.md in docs/changes/

2. **Create AssignTaskModal Component**
   - [ ] Create `src/components/agents/AssignTaskModal.tsx`
   - [ ] Use Shadcn Dialog with global route /agents/assign/:id
   - [ ] Fetch agent data by ID from AgentStore
   - [ ] Add form fields: Custom Instruction (Textarea), Mode (Switch), Model (Dropdown), Files (List), Output Path (Selector)
   - [ ] Use React Hook Form for form state management
   - [ ] Add loading state during task submission

3. **Implement Mode Switch (Single/Bulk)**
   - [ ] Add Mode switch using Shadcn Switch component
   - [ ] Default to Single mode (1 file limit)
   - [ ] Bulk mode allows up to 10 files
   - [ ] Show file count indicator: "1/1 file selected" (Single) or "3/10 files selected" (Bulk)
   - [ ] Disable Add File button when limit reached
   - [ ] Show validation error if user tries to submit with 0 files

4. **Create Add File Selection Modal**
   - [ ] Create `src/components/agents/AddFileModal.tsx`
   - [ ] Reuse LibraryGrid component for file browsing: `<LibraryGrid readOnly selectionMode />`
   - [ ] Reuse BreadcrumbNavigation for folder navigation
   - [ ] Add file type filter: PDF, DOCX, TXT, MD only
   - [ ] Allow inline upload if file not present (reuse UploadModal simplified version)
   - [ ] Display selected files as chips with remove button
   - [ ] Generate presigned preview URL for each selected file (1 hour expiry)
   - [ ] Store file IDs and preview URLs in form state

5. **Create Output Path Selector**
   - [ ] Create `src/components/agents/OutputPathSelector.tsx` based on fixed MoveToModal
   - [ ] Reuse folder hierarchy navigation from Library
   - [ ] Add "Create New Folder" inline option (expands to name input + Create button)
   - [ ] Show breadcrumb of selected output path
   - [ ] Default to Library root if no selection
   - [ ] Validate output path exists before task submission
   - [ ] Store selected folderId in form state

6. **Implement n8n Webhook Payload Construction**
   - [ ] Create payload structure:
     ```typescript
     interface N8nTaskPayload {
       agentId: string;
       taskId: string; // UUID generated client-side
       customInstruction?: string;
       model: string; // OpenRouter model code
       mode: 'single' | 'bulk';
       files: Array<{ fileId: string; previewUrl: string; name: string }>;
       outputPath: { folderId: string; path: string };
       callbackUrl: string; // Backend webhook receive endpoint
     }
     ```
   - [ ] Add task to AgentTaskQueueStore on Send button click
   - [ ] Make POST request to agent.webhookUrl with payload
   - [ ] Show success toast: "Task assigned to {agentName}"
   - [ ] Close modal and show task in progress queue (bottom-right)

7. **Integrate with Agent Task Queue**
   - [ ] Add task to AgentTaskQueueStore: addToQueue(task)
   - [ ] Set initial status: 'pending'
   - [ ] Add task metadata: agentId, model, fileCount, timestamp
   - [ ] Update progress display in UploadProgress-style component
   - [ ] Handle n8n webhook errors with retry logic (3 attempts)

#### **Files to Modify/Create:**
- `src/components/library/MoveToModal.tsx` (Fix abrupt closing bug) [Status: 🔶]
- `src/components/agents/AssignTaskModal.tsx` (Create task assignment modal) [Status: ❌]
- `src/components/agents/AddFileModal.tsx` (Create file selection modal) [Status: ❌]
- `src/components/agents/OutputPathSelector.tsx` (Create output path selector) [Status: ❌]
- `src/components/agents/ModelSelectionDropdown.tsx` (Reuse from Phase 5) [Status: 🔄]
- `src/api/agentsApi.ts` (Add assignTask function) [Status: 🔄]
- `src/store/agentTaskQueueStore.ts` (Add task queue management actions) [Status: 🔄]
- `docs/changes/BUGFIX_MOVETMODAL.md` (Document MoveToModal fix) [Status: ❌]

#### **Performance Metrics:**
- **Before:** No task assignment UI; MoveToModal has abrupt closing bug
- **Target:** Modal opens in <300ms; File selection <500ms; MoveToModal bug fixed; Task submits in <1s
- **Measurement Tools:** React DevTools, Chrome Network tab, manual testing

#### **Testing Strategy:**
- [ ] Test MoveToModal fix: modal stays open during folder navigation
- [ ] Test AssignTaskModal opens with correct agent data
- [ ] Test Mode switch correctly limits file selection (1 for Single, 10 for Bulk)
- [ ] Test Add File modal displays Library grid and allows file selection
- [ ] Test inline upload works if file not present in Library
- [ ] Test Output Path selector allows folder selection and Create New Folder inline
- [ ] Test Custom Instruction textarea accepts multiline input
- [ ] Test Send button constructs correct n8n payload and submits
- [ ] Test task appears in AgentTaskQueueStore with 'pending' status
- [ ] Test validation errors display for missing files or output path

#### **Code Quality Checks:**
- [ ] AssignTaskModal follows existing modal patterns (UploadModal, MoveToModal)
- [ ] Library component reuse properly isolated (readOnly, selectionMode props)
- [ ] n8n payload structure typed with TypeScript interface
- [ ] File preview URL generation uses existing presignedUrlService
- [ ] Output path validation reuses folder existence checks from Library
- [ ] ESLint passes with zero warnings

---

### **Phase 7: Task Progress Queue & Notification System (Frontend + Backend)**
**Target:** Implement Agent task progress tracking and completion notifications
**Status:** 🔴 Planning
**Priority:** ⚡ High
**Lead:** Frontend Agent (UI) + Backend Agent (Webhook handling)

#### **Technical Assessment:**
- **Current Issues:** No task progress visualization; n8n webhook receiver incomplete; No notification system for task completion
- **Performance Impact:** Enables real-time task tracking and user notifications
- **Risk Level:** Medium (real-time updates, webhook handling)
- **Dependencies:** Phase 2 (Webhook receiver), Phase 6 (Task assignment)

#### **Objectives:**
- [ ] Create AgentTaskProgress component reusing UploadProgress patterns
- [ ] Display task queue in bottom-right corner (collapsible)
- [ ] Show task status: pending, processing, completed, failed
- [ ] Integrate sonner toast notifications for task completion/failure
- [ ] Update backend webhook receiver to save files and notify frontend
- [ ] Implement task status polling or WebSocket for real-time updates

#### **Scope:**
- **Included:** Progress UI, task status tracking, notifications, webhook file handling, real-time updates
- **Excluded:** n8n workflow management, detailed error diagnostics, task cancellation
- **Boundaries:** Progress tracking only; execution happens in n8n
- **Success Metrics:** Progress queue displays tasks; Notifications trigger on completion; Files saved to S3

#### **Technical Tasks:**

1. **Create AgentTaskProgress Component (Frontend)**
   - [ ] Create `src/components/agents/AgentTaskProgress.tsx` based on UploadProgress.tsx
   - [ ] Display task queue from AgentTaskQueueStore
   - [ ] Show task info: Agent name, file count, model, status
   - [ ] Add progress bar (indeterminate for processing, 100% for completed)
   - [ ] Add collapsible header: "Agent Tasks (3 active)"
   - [ ] Position bottom-right corner with fixed position
   - [ ] Add close button to dismiss completed tasks

2. **Implement Task Status Display**
   - [ ] Show status badges: Pending (gray), Processing (blue), Completed (green), Failed (red)
   - [ ] Add status icons: Clock (pending), Loader (processing), CheckCircle (completed), XCircle (failed)
   - [ ] Show elapsed time for processing tasks
   - [ ] Show completion time for finished tasks
   - [ ] Group tasks by status in collapsible sections

3. **Integrate Sonner Toast Notifications (Frontend)**
   - [ ] Use sonner for toast notifications: `import { toast } from 'sonner'`
   - [ ] Show success toast on task completion: "Task completed! Output saved to {path}"
   - [ ] Show error toast on task failure: "Task failed: {error message}"
   - [ ] Add "View Output" action button in success toast (navigates to output file)
   - [ ] Add "Retry" action button in error toast (resubmits task)
   - [ ] Ensure toasts don't spam (max 3 visible at once)

4. **Update Backend Webhook Receiver (Backend)**
   - [ ] Enhance POST /api/agents/webhook/receive endpoint
   - [ ] Accept multipart/form-data with file + metadata (taskId, agentId, outputPath, status)
   - [ ] Validate taskId and outputPath exist
   - [ ] Upload file to S3 at specified outputPath using StorageProviderService
   - [ ] Create File record in Prisma: `prisma.file.create({ name, size, type, s3Key, folderId })`
   - [ ] Return success response: { success: true, fileId, s3Key, downloadUrl }
   - [ ] Handle upload errors and return detailed error messages

5. **Implement Task Status Polling (Frontend)**
   - [ ] Create useAgentTaskPolling custom hook
   - [ ] Poll backend for task status updates every 5 seconds for active tasks
   - [ ] Update AgentTaskQueueStore with latest status
   - [ ] Stop polling when task reaches terminal state (completed/failed)
   - [ ] Add manual refresh button for immediate status check
   - [ ] Optimize polling: only poll tasks in 'processing' state

6. **Add Task Status Tracking Backend Endpoint (Backend)**
   - [ ] Create GET /api/agents/tasks/:taskId endpoint
   - [ ] Return task status: { taskId, agentId, status, startedAt, completedAt, outputFileId, error }
   - [ ] Store task metadata in database (new AgentTask Prisma model)
   - [ ] Update task status when webhook receives completion from n8n
   - [ ] Add task history endpoint: GET /api/agents/:agentId/tasks (paginated)

7. **Implement WebSocket Alternative (Optional)**
   - [ ] If polling insufficient, add Socket.io to backend
   - [ ] Emit task status updates to connected clients
   - [ ] Subscribe to task updates in AgentTaskProgress component
   - [ ] Update AgentTaskQueueStore in real-time
   - [ ] Handle connection failures and fallback to polling

#### **Files to Modify/Create:**
- `src/components/agents/AgentTaskProgress.tsx` (Create task progress UI) [Status: ❌]
- `src/hooks/useAgentTaskPolling.ts` (Create task polling hook) [Status: ❌]
- `src/store/agentTaskQueueStore.ts` (Add task status update actions) [Status: 🔄]
- `backend/src/routes/agents.routes.ts` (Add task status endpoints) [Status: 🔄]
- `backend/src/controllers/AgentsController.ts` (Add getTaskStatus, getTaskHistory) [Status: 🔄]
- `backend/prisma/schema.prisma` (Add AgentTask model) [Status: 🔄]
- `backend/src/controllers/AgentsController.ts` (Update webhook receiver) [Status: 🔄]
- `src/pages/AgentsPage.tsx` (Add AgentTaskProgress component) [Status: 🔄]

#### **Performance Metrics:**
- **Before:** No task progress tracking; Webhook receiver incomplete
- **Target:** Progress updates every 5s; Notifications <500ms after completion; Files uploaded to S3 <2s
- **Measurement Tools:** Chrome Network tab, React DevTools, backend logs

#### **Testing Strategy:**
- [ ] Test AgentTaskProgress displays tasks in queue correctly
- [ ] Test task status updates in real-time (or every 5s with polling)
- [ ] Test sonner toasts trigger on task completion and failure
- [ ] Test webhook receiver saves files to correct S3 output path
- [ ] Test File records created in database with correct metadata
- [ ] Test "View Output" button navigates to file in Library
- [ ] Test "Retry" button resubmits failed task
- [ ] Test progress queue collapses/expands correctly
- [ ] Test polling stops when all tasks completed

#### **Code Quality Checks:**
- [ ] AgentTaskProgress follows UploadProgress component patterns
- [ ] Task polling hook properly cleans up intervals on unmount
- [ ] Sonner toast configuration matches existing notification patterns
- [ ] Backend webhook receiver handles all error cases gracefully
- [ ] AgentTask Prisma model follows existing model patterns
- [ ] WebSocket implementation (if added) handles reconnection properly
- [ ] ESLint passes with zero warnings

---

## Cross-Domain Dependencies

### **Frontend → Backend Dependencies**
- Phase 1 (Frontend) establishes TypeScript types that inform Phase 2 (Backend) API contract
- Phase 3 (Frontend) depends on Phase 2 (Backend) Agent CRUD endpoints for data fetching
- Phase 4 (Frontend) depends on Phase 2 (Backend) PUT/DELETE endpoints for Agent management
- Phase 5 (Frontend) depends on Phase 2 (Backend) POST endpoint for Agent creation
- Phase 6 (Frontend) depends on Phase 2 (Backend) webhook receiver for task submission
- Phase 7 (Frontend) depends on Phase 2 & 7 (Backend) webhook handling and task status endpoints

### **Backend → Frontend Dependencies**
- Phase 2 (Backend) references Phase 1 (Frontend) types for API response format consistency
- Phase 7 (Backend) webhook receiver depends on Phase 6 (Frontend) payload structure

### **Library Page → Agents Page Dependencies**
- Phase 3 (Agents) reuses FolderCard design patterns from Library
- Phase 6 (Agents) reuses LibraryGrid, BreadcrumbNavigation, UploadModal from Library
- Phase 6 (Agents) requires MoveToModal bug fix before reuse
- Phase 7 (Agents) reuses UploadProgress component patterns from Library

### **External Dependencies**
- n8n Railway instance must be accessible for webhook health checks (Phase 2)
- n8n workflows must send files to backend webhook receiver (Phase 7)
- OpenRouter API codes must match model selection dropdown (Phase 5)
- S3 storage must be configured for file uploads from n8n (Phase 7)

---

## Quality Assurance & Testing Strategy

### **Unit Testing**
- [ ] AgentStore actions: addAgent, updateAgent, deleteAgent, addTask, updateTaskProgress
- [ ] AgentTaskQueueStore actions: addToQueue, updateProgress, removeFromQueue
- [ ] ModelProviderIcon resolver utility returns correct icons
- [ ] n8n payload construction creates valid structure
- [ ] Health check polling updates status correctly
- [ ] File selection respects mode limits (Single: 1, Bulk: 10)

### **Integration Testing**
- [ ] Create Agent flow: Create button → Modal → Submit → API → Store → UI update
- [ ] Configure Agent flow: Configure button → Modal → Edit → Save → API → Store → UI update
- [ ] Delete Agent flow: Delete button → Confirmation → API → Store → UI update
- [ ] Assign Task flow: Assign button → Modal → File selection → Output path → Submit → n8n → Progress queue
- [ ] Task completion flow: n8n → Webhook receiver → File save → Status update → Notification
- [ ] Health check flow: Manual check → API → Status update → UI indicator

### **End-to-End Testing**
- [ ] Full Agent lifecycle: Create → Configure → Health Check → Assign Task → Task Completion → View Output
- [ ] Library integration: Select files from Library → Assign to Agent → Output saved to Library
- [ ] Error handling: API failures, n8n timeouts, invalid webhook URLs, file upload failures
- [ ] CORS validation: n8n Railway instance allowed, unauthorized origins blocked
- [ ] Notification system: Toasts trigger correctly, actions work (View Output, Retry)

### **Performance Testing**
- [ ] Agent list pagination: Test with 100+ agents
- [ ] Health check polling: Monitor network traffic, CPU usage
- [ ] Task queue: Test with 20+ concurrent tasks
- [ ] File selection modal: Test with 1000+ files in Library
- [ ] Model dropdown: Test search performance with 10+ models

### **Accessibility Testing**
- [ ] All modals keyboard navigable (Tab, Escape, Enter)
- [ ] Status indicators have text alternatives (aria-label)
- [ ] Form fields have proper labels and error messages
- [ ] Color indicators not sole method of conveying status
- [ ] Screen reader announces task status changes

### **Cross-Browser Testing**
- [ ] Test in Chrome, Firefox, Safari, Edge
- [ ] Test on mobile devices (iOS Safari, Android Chrome)
- [ ] Test dark/light theme compatibility
- [ ] Test icon rendering in all browsers
- [ ] Test modal behavior on small screens

---

## Appendices

### **Appendix A: Model Provider Icon Implementation Details**

**Primary Icon Library:** `@lobehub/icons`
- Supports: OpenAI (with GPT variants), Google (Gemini variants), DeepSeek
- Usage: `import { OpenAI, Google, DeepSeek } from '@lobehub/icons'`
- Rendering: `<OpenAI.Color size={24} />` for colored icons
- Advantages: Purpose-built for AI models, includes brand colors, React components

**Fallback Icon Library:** `simple-icons`
- Supports: 3300+ brand logos including OpenAI, Google, DeepSeek
- Usage: `import { siOpenai, siGoogle } from 'simple-icons'`
- Rendering: SVG paths require custom wrapper component
- Advantages: Extensive coverage, official brand assets

**Icon Resolution Strategy:**
```typescript
const getProviderIcon = (provider: string, size: number = 24): ReactNode => {
  const icons = {
    openai: <OpenAI.Color size={size} />,
    google: <Google.Color size={size} />,
    deepseek: <DeepSeek.Color size={size} />,
  };
  return icons[provider] || <BrainCircuit size={size} />; // Lucide fallback
};
```

### **Appendix B: n8n Webhook Payload Specification**

**Outgoing Payload (Frontend → n8n):**
```json
{
  "agentId": "uuid-v4",
  "taskId": "uuid-v4",
  "customInstruction": "Optional instruction text",
  "model": "openai/gpt-4.1",
  "mode": "single",
  "files": [
    {
      "fileId": "uuid-v4",
      "previewUrl": "https://s3.../presigned-url?expires=3600",
      "name": "document.pdf",
      "type": "application/pdf"
    }
  ],
  "outputPath": {
    "folderId": "uuid-v4",
    "path": "/Research/Summaries"
  },
  "callbackUrl": "https://backend.../api/agents/webhook/receive"
}
```

**Incoming Payload (n8n → Backend):**
```json
{
  "taskId": "uuid-v4",
  "agentId": "uuid-v4",
  "status": "completed",
  "outputFile": "multipart/form-data",
  "outputPath": {
    "folderId": "uuid-v4"
  },
  "metadata": {
    "processingTime": 45000,
    "model": "openai/gpt-4.1",
    "tokensUsed": 12500
  },
  "error": null
}
```

### **Appendix C: CORS Configuration for n8n Railway**

**Environment Variables:**
```bash
# backend/.env
N8N_WEBHOOK_ORIGIN=https://your-n8n-instance.railway.app
N8N_WEBHOOK_IP=123.456.789.012  # Optional: Railway IP whitelist
```

**CORS Middleware Configuration:**
```typescript
// backend/src/middleware/cors.ts
const agentWebhookCors = cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.N8N_WEBHOOK_ORIGIN,
      /^https?:\/\/.*\.railway\.app$/,  // All Railway domains
      /^http:\/\/localhost:\d+$/,        // Local testing
    ];
    if (!origin || allowedOrigins.some(allowed => 
      typeof allowed === 'string' ? allowed === origin : allowed.test(origin)
    )) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Agent-Key'],
  credentials: false,
});

// Apply to webhook route only
app.post('/api/agents/webhook/receive', agentWebhookCors, webhookController);
```

### **Appendix D: AgentStore Schema**

```typescript
// src/store/agentStore.ts
interface AgentStoreState {
  agents: Agent[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setAgents: (agents: Agent[]) => void;
  addAgent: (agent: Agent) => void;
  updateAgent: (agentId: string, updates: Partial<Agent>) => void;
  deleteAgent: (agentId: string) => void;
  checkAgentHealth: (agentId: string) => Promise<void>;
  
  // Selection
  selectedAgentId: string | null;
  setSelectedAgentId: (id: string | null) => void;
}

interface Agent {
  id: string;
  name: string;
  description?: string;
  webhookUrl: string;
  endpointStatus: 'reachable' | 'unreachable' | 'checking';
  lastHealthCheck?: Date;
  modelPreference?: string; // Default model for this agent
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### **Appendix E: Phase Execution Timeline**

**Week 1:**
- Phase 1: Foundation Setup (Frontend) - 2 days
- Phase 2: Backend API Endpoints (Backend) - 3 days

**Week 2:**
- Phase 3: Agent Card & Grid (Frontend) - 2 days
- Phase 4: Configure Modal (Frontend) - 2 days
- Phase 5: Create Agent Modal (Frontend) - 1 day

**Week 3:**
- Phase 6: Assign Task Modal (Frontend) - 3 days (includes MoveToModal fix)
- Phase 7: Task Progress & Notifications (Frontend + Backend) - 2 days

**Total Estimated Time:** 15 development days (~3 weeks)

**Critical Path:**
Phase 1 → Phase 2 → Phase 3 → Phase 6 → Phase 7

**Parallel Opportunities:**
- Phase 4 & Phase 5 can be developed in parallel after Phase 3
- Phase 7 backend work can start after Phase 2, parallel to Phase 6 frontend

---

**PLAN STATUS:** ✅ Ready for Implementation
**Next Action:** Frontend Agent begins Phase 1 foundation setup
**Review Date:** After Phase 2 completion for mid-plan retrospective
