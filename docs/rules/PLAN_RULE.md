# Research Space - Global PLAN File Standards & Contribution Rules

> **Created:** September 3, 2025
> **Last Updated:** September 3, 2025
> **Status:** ✅ **Active - Mandatory Compliance Required**
> **Authority:** Global standards for all contributors and AI agents
> **Compliance:** Zero tolerance for violations - all PLAN files must follow these rules

## 🎯 Core Principles

### **MANDATORY COMPLIANCE**
All contributors, AI agents, and team members **MUST** follow these rules without exception. PLAN files that violate these standards will be rejected and require immediate revision.

### **ZERO TOLERANCE POLICY**
- No summaries, introductions, or explanatory text in PLAN files
- No file structure descriptions or architecture explanations
- No fluff, padding, or unnecessary content
- Only executable phases and tasks with measurable outcomes

## 📋 PLAN File Structure Standard

### **MANDATORY HEADER FORMAT**
Every PLAN file must begin with this exact header structure:

```markdown
# Research Space - [DOMAIN] Implementation Plan

> **Created:** [Date]
> **Last Updated:** [Date]
> **Status:** [🔴 Planning | 🟡 In Progress | ✅ Complete]
> **Priority:** [🚨 Critical | ⚡ High | 📋 Medium | 🔄 Low]
> **Domain Lead:** [Agent/Contributor Name]
> **Tracking:** [Current Phase/Total Phases]
```

### **MANDATORY CONTENT STRUCTURE**
PLAN files contain **ONLY** these sections in exact order:

1. **Development Phases** (numbered sequentially)
2. **Cross-Domain Dependencies**
3. **Quality Assurance & Testing Strategy**
4. **Appendices** (if applicable)

**ABSOLUTELY NO OTHER SECTIONS ALLOWED**

## 🚀 Phase Structure Standard

### **MANDATORY PHASE HEADER**
```markdown
### **Phase [Number]: [Phase Name]**
**Target:** [Single clear objective statement - max 15 words]
**Status:** [🔴 Planning | 🟡 In Progress | ✅ Complete]
**Priority:** [🚨 Critical | ⚡ High | 📋 Medium | 🔄 Low]

#### **Technical Assessment:**
- **Current Issues:** [List of specific problems - max 3 bullet points]
- **Performance Impact:** [Expected improvement metrics]
- **Risk Level:** [Low | Medium | High]
- **Dependencies:** [Phase or external dependencies]

#### **Objectives:**
- [ ] [Specific, measurable objective with checkbox]

#### **Scope:**
- **Included:** [What is covered]
- **Excluded:** [What is explicitly not included]
- **Boundaries:** [Clear scope limitations]
- **Success Metrics:** [How success will be measured]

#### **Technical Tasks:**
1. **[Task Category Name]**
   - [ ] [Specific implementation task]

#### **Files to Modify/Create:**
- `path/to/file.ext` (Description of changes) [Status: ✅|❌|🔄]

#### **Performance Metrics:**
- **Before:** [Current state metrics]
- **Target:** [Expected performance improvements]
- **Measurement Tools:** [How metrics will be tracked]

#### **Testing Strategy:**
- [ ] [Specific testing requirements]

#### **Code Quality Checks:**
- [ ] [Code standards requirements]
```

## 📂 Domain-Specific Folder Organization

### **MANDATORY FOLDER STRUCTURE**
```
docs/rules/PLAN_RULE.md              # Global standards (this file)
docs/plans/
├── backend/                  # Backend development plans
├── frontend/                 # Frontend development plans
├── ui/                       # UI/UX implementation plans
```

### **DOMAIN FOLDER ASSIGNMENTS**

#### **Backend Domain (`docs/plans/backend/`)**
- **Responsible Agent:** Backend Developer Agent
- **File Naming:** `BACKEND_PLAN.md`
- **Scope:** API development, database design, server architecture
- **Dependencies:** Frontend requirements, security constraints

#### **Frontend Domain (`docs/plans/frontend/`)**
- **Responsible Agent:** Frontend Developer Agent
- **File Naming:** `FRONTEND_PLAN.md`
- **Scope:** React components, state management, performance optimization
- **Dependencies:** UI/UX designs, backend APIs

#### **UI/UX Domain (`docs/plans/ui/`)**
- **Responsible Agent:** UI/UX Designer Agent
- **File Naming:** `UIUX_PLAN.md`
- **Scope:** Design systems, user experience, accessibility
- **Dependencies:** Frontend implementation requirements

## 📝 PLAN File Creation & Management Protocol

### **CREATION PROTOCOL**
1. **Domain Assignment**: Agent receives domain assignment from project lead
2. **Template Usage**: Use exact template structure from PLAN_RULE.md
3. **Content Restriction**: Include ONLY phases, tasks, and mandatory sections
4. **File Placement**: Place in assigned domain folder with correct naming
5. **Initial Review**: Submit for immediate review by project lead

### **UPDATE PROTOCOL**
1. **Daily Status Updates**: Update status icons and completion checkboxes
2. **Phase Completion**: Mark phases complete only when ALL tasks finished
3. **Dependency Tracking**: Update cross-domain dependencies as they change
4. **Quality Assurance**: Run through QA checklist before commits

### **TRACKING PROTOCOL**
1. **Real-time Updates**: Update plan status immediately after task completion
2. **Progress Metrics**: Maintain accurate completion percentages
3. **Blocker Documentation**: Document any blockers with specific solutions
4. **Timeline Adherence**: Report any timeline deviations immediately

## 🔄 Status Tracking Standards

### **MANDATORY STATUS ICONS**
- 🔴 **Planning** - Phase designed but not started
- 🟡 **In Progress** - Phase actively being worked on
- ✅ **Complete** - Phase finished and validated
- ❌ **Blocked** - Cannot proceed due to dependencies
- 🔄 **Review** - Under review or testing

### **PRIORITY LEVELS**
- 🚨 **Critical** - Project blockers, security issues
- ⚡ **High** - Major features, performance improvements
- 📋 **Medium** - Standard features, enhancements
- 🔄 **Low** - Nice-to-have features, optimizations

### **FILE STATUS TRACKING**
- ✅ **Complete** - File modification/creation finished and tested
- ❌ **Not Started** - No work begun on this file
- 🔄 **In Progress** - File being modified or created
- 🔶 **Review** - File completed but under review
- ❌ **Blocked** - File cannot be completed due to dependencies

## 📊 Quality Assurance & Testing Strategy

### **MANDATORY QA CHECKLIST**
Before marking any phase complete, agents MUST verify:

#### **Content Compliance**
- [ ] No summaries, introductions, or explanatory text
- [ ] No file structure descriptions or architecture explanations
- [ ] No fluff, padding, or unnecessary content
- [ ] Only executable phases and tasks with measurable outcomes

#### **Format Compliance**
- [ ] Exact header format used
- [ ] Mandatory sections present in correct order
- [ ] Status icons used correctly
- [ ] Priority levels assigned appropriately

#### **Technical Compliance**
- [ ] All tasks have specific, measurable outcomes
- [ ] File paths are accurate and complete
- [ ] Dependencies clearly identified
- [ ] Success metrics defined and measurable

#### **Tracking Compliance**
- [ ] Real-time status updates maintained
- [ ] Completion checkboxes updated immediately
- [ ] Cross-domain dependencies tracked
- [ ] Timeline adherence monitored

## 🚫 Strict Content Restrictions

### **ABSOLUTELY PROHIBITED CONTENT**
- ❌ Project summaries or overviews
- ❌ File structure explanations
- ❌ Architecture descriptions
- ❌ Technology stack explanations
- ❌ Background information
- ❌ Future plans or roadmaps
- ❌ Personal opinions or suggestions
- ❌ Marketing or promotional content

### **ALLOWED CONTENT ONLY**
- ✅ Phase definitions with clear targets
- ✅ Specific, measurable tasks
- ✅ File modification lists with status
- ✅ Performance metrics with baselines
- ✅ Testing strategies with specific requirements
- ✅ Code quality checks with standards

## 📈 Performance Metrics & Tracking

### **MANDATORY METRICS TRACKING**
Each PLAN file must include:

#### **Completion Metrics**
- Phase completion percentage
- Task completion rate
- File modification status
- Dependency resolution rate

#### **Quality Metrics**
- Format compliance score
- Content restriction adherence
- Review feedback incorporation
- Timeline adherence percentage

#### **Performance Metrics**
- Task completion velocity
- Blocker resolution time
- Cross-domain coordination efficiency
- Quality assurance pass rate

## 🔗 Cross-Domain Dependencies

### **DEPENDENCY MANAGEMENT**
- **Frontend Plans**: Must coordinate with UI/UX and Backend plans
- **Backend Plans**: Must align with Security and Testing requirements
- **UI/UX Plans**: Must support Frontend implementation requirements

### **DEPENDENCY TRACKING**
- Update dependency status in real-time
- Document blocking dependencies immediately
- Coordinate with dependent domain leads
- Maintain dependency resolution timeline

## 📚 Appendices

### **Appendix A: Template Library**
- Complete phase templates for each domain
- File modification templates
- Status tracking templates
- Dependency documentation templates

### **Appendix B: Domain Responsibility Matrix**
- Agent assignment matrix
- Domain scope definitions
- Responsibility boundaries
- Escalation procedures

### **Appendix C: Quality Assurance Checklist**
- Pre-commit QA checklist
- Post-completion validation checklist
- Cross-domain integration checklist
- Final project audit checklist

---

**PLAN_RULE.md Status: ✅ ACTIVE - MANDATORY COMPLIANCE REQUIRED**  
**Last Compliance Audit:** September 3, 2025  
**Next Audit:** September 10, 2025**