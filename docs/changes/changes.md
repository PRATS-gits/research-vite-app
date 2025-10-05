# Research Space: Entire Application Adhoc Overview

## Research Space: A modern SaaS application for academics and researchers with library management system, external source connections and AI Agents for research specific operations.

---
# Foundation Design Layout
1) The **Layout** of the Research Space application will contain **collapsible sidebar, header/navbar and page content space.**
2) The **sidebar and navbar** on the Layout will be **fit-to-window and unscrollable**.
3) Every page content and features will be displayed between the navbar and sidebar section of the Layout which we named as **page content space**.
4) The sidebar will have the options of **(Home, Library, Agents, Connections, Status, Settings and Profile (at the bottom of sidebar))** which will serve as the routes to the specific pages with the same name as options in the sidebar.
5) The navbar of the application will dynamically display the **page name** as the user routes to it and the page content is displayed in the page content space. This will be positioned at the **left-hand side** of the navbar just outside the button of the sidebar.
6) The navbar will have a **search bar** at the center whose primary purpose would be routing user to the **specific page** which contains that particular service or option.
7) The navbar will have a **notification bell icon and theme switcher icon**. These iconse will be placed in the **right-hand side** of the navbar. 
8) The **notification bell icon** will preview a modal in front of the screen with route `(/#/notifications)`, this will ensure that the notifications preview modal will open anywhere throughout the course of application irrespective of what page the user is.
9) The **theme switcher icon** will change the application theme to **light and dark mode**. It will show moon icon when dark theme is enabled and sun icon when light theme is enabled. The theme switcher will have a smooth transition animation when the theme will switch from ligh to dark mode and vice versa.
10) The Layout of the application will be initialized by **Shadcn prebuilt layout** with command `npx shadcn init https://ui-experiment-03.vercel.app/r/experiment-03.json`. This command will install all the necessary components, buttons, blocks and will modify global CSS which are originally used to create this layout template of Shadcn. The live demo of the layout is available at (https://crafted.is/exp3).
11) This prebuilt layout of Shadcn will cater most of our needs as this will setup the foundation and we can tweak this layout according to our needs. This layout **uses external dependencies (eg. recharts, etc.)** so some files may show TSX error which can be fixed by installing the missing dependencies this layout's component files use.
12) The Layout will ensure that the page content space will **dynamically adjust the contents, components and blocks of the specific pages** based on the collapsible nature of the sidebar when its open and closed. The **page content space** will have absolute freedom of scrolling and adjusting virtual views where required.
13) After the foundation layout and necessary requirements are satisfied then we'll move to pages.
---

# Page Design Layout
1) All the pages and their content as discussed in the **Foundation Design Layout** will be displayed in the **page content space** which is the crucial part of the Layout that lies between sidebar and navbar.<br>Let's see the page design descriptions for the following pages:
## Home Page (/home or /)
a) **Home Page** will be displaying some specific contents of all other pages which are available in the application. Along with it some quick actions based on user's most used/recently visited page or services.<br>
b) Home Page will have a **"Welcome back, User!👋🏻"** message displayed at the top-left of the page content space below the navbar with a **size of 24px or appropriate**.<br>
c) Home Page will display the counts of documents which are there in **Library**, no. of **Agents** which are there in the application, connection status from **Connections** (i.e. Google Drive Connected and S3 Storage Connected) and status message from various service as (Operational, Warning, etc.) from **Status**.<br>
d) All the above mentioned in c) would be displayed as **tiles/cards** so that user can click on them and the page content will be displayed dynamically in the page content space. (i.e. If the user clicks on the card of connection status then the Connection page content will be displayed).

## Library Page (/library)
a) **Library Page** is the crucial page of this application. As its going to contain various components which will be required for proper functioning and enhanced user experience. This will serve as a **Google Drive** experience which is built within the Research Space application's Library Page.<br>
b) Library Page will have a **resizable search bar** which will be dedicated to the searches related to the Library **contents such as folders, files, etc**. This will be positioned in the top-left of the page content space below the navbar and beside the sidebar. This will ensure and adhere to the adjustable nature of the page content space as discussed in the **Foundation Design Layout**.<br>
c) Library Page will have these default options **(Create, Upload, Filter and Sort)**. These options will be positioned in the top-right of the page content space opposite to the resizable search bar.<br>
d) Library Page will have these hidden options **(Edit, View and Delete)** which will be shown instead of default options **(Create and Upload)**. These options will only be visible when any folder or file content of the Library Page is selected via checkbox.
e) The default options functionalities: <br>
i) **Create:** When the user click the Create option a drop-down pop-over appears asking users to create a file or folder. If the user selects create file option then we'll display a sweet alert that "This feature is currently in development. Upload a file instead". If the user selects create folder option then we'll display a modal `(/library/#/createFolder)` which will allow user to set the name of the folder, tags (Research Papers, Spreadsheets, Images, etc.) and once he confirms the action a new card will be displayed on the Library Page with its name, tag, no. files, no. of folders it has.<br>
ii) **Upload:** When the user click the Upload option a drop-down pop-over appears asking user to upload a file(s) or folder. If the user selects file(s)/folder upload then we'll display a modal `(library/#/uploadFile)` or `(library/#/uploadFolder)`. This modal will have a tracking system of 4 steps [Step-1: Select the source of upload (Local Storage, OneDrive, Google Drive or URL), Step-2: From the selected source we'll open up a preview if its Local Storage then File Explorer of that system will be triggered, similarly for OneDrive and Google Drive which will be integrated in future and an input box if URL is an upload source, Step-3: The file(s)/folder info will be displayed (eg. File Name: Paper-1.pdf, size: 1.2 MB, etc.) and Step-4: A quick uploading animation will be played and "Uploaded Successfully" type of message will be displayed and the modal will be closed].<br>
iii) **Filter and Sort**: These options will do their default jobs which are required to serve the requirements and small features of a modern Library management system.<br>
iv) **Edit**: When the user clicks this option we'll display a sweet alert "This feature is currently in development".<br>
v) **View**: When the user clicks this option file (PDF, Image) will be opened in a new tab since and will be served via a preview URL. Since under the hood its going to use **S3, R2 storage buckets** whose configuration will be discussed in detailed.<br>
vi) **Delete**: When the user clicks this option an alert modal will appear in front of the screen confirming user action with a message like "Are you sure you want to delete this file(s) or folder? As it cannot be recovered".<br>
f) The whole Library Page will be functioning as a **Google Drive** experience which will be having modern functionalities like **dragging files to folder, nested folder creation, renaming, and additional feature engineering** which might be required.<br>
g) The Library Page will be pointing to a bucket from **Amazon S3 or Cloudflare R2** which have the same SDK methods application and CRUD, fetch and store definition regarding which we'll refer to the documentations. So that no matter what object storage provider is used under the hood the connections will be simple and would be done via the **Connections Page** in the Frontend.

## Connections Page (/connections)
a) **Connections Page** serves as the heart of the Library Page on which all the major operations are going to be performed and will be referenced throughout the application.<br>
b) Connections Page will provide S3, R2 compatible bucket configuration and setup for Library Page to point to that specific bucket from which major operations are going to be performed.<br>
c) Google Drive and OneDrive connections will also be served and configured via the Connections Page. But for development purposes it'll be future implementation.


## Agents Page (/agents)
a) **Agents Page** serves as the second major functionality of the Research Space project. This is also highly integrated with the **Library Page** functionalities so we'll take great precautions while builing it.<br>
b) Agents functionality will be powered by **n8n** (https://n8n.io). For the Research Space porject I've self-hosted n8n on Railway. So similar to backend connections we'll include **env variable** file to include appropriate variables needed to connect to n8n which is hosted on Railway.<br>
c) So here are the functionalities which will be present on Agents Page:<br>
i) Similar to Library Page there will be options (**Create**) which will be visible by default.<br>
ii) Similar to Library Page there will Agents Card component which will be cuboid shaped allowing two Agent Cards to be visible in a single-row just like how its visible in the dummy content currently.<br>
iii) Agents Cards will have **Configure** option which will be positioned in the bottom-right of the card component.<br>
iv) **Configure:** This option will open up a modal with global route `(/agents/configure/:id)` where `:id` will be the unique `agentID` similar to Folder ID which is present in Library Page functionality.
- This Configure option will actually fetch the resources related to that Agent (i.e. Name, ID, Endpoint URL (n8n's webhook URL which will start the Agent Workflow), and Delete option to delete the Agent cofiguration).
v) **Assign Task**: This option will be positioned in the bottom-left of the Agent Card component. This option will also open a modal at global route `(/agents/assign/:id)`.
- This modal will have a form-like Agent configuration look. Where there will be inputs regarding (Custom Instruction (optional), Mode (Single and Bulk), Model Selection Drop-down [`Auto (default GPT-4.1), GPT-4.1, GPT-4.1 Mini, GPT-5, GPT-5 Mini, Gemini-2.5 Flash, Gemini-2.5 Flash Lite, DeepSeek V3 0324, DeepSeek V3.1`], Add File, Output (allowing user to save in the existing Library root, folder or create a new folder and save it there) and Send Button).
- *Model Selection Drop-down:* This will be a drop-down popover which will show the logo of their provider (i.e. OpenAI, Google, DeepSeek, etc.). Here we need to perform web search on which dependency or icons which we need to install that will give us those icons. Here are the proper model codes from OpenRouter we need to send to that webhook while sending the HTTP request (`openai/gpt-4.1, openai/gpt-4.1-mini, openai/gpt-5, openai/gpt-5-mini, google/gemini-2.5-flash, google/gemini-2.5-flash-lite, google/gemini-2.5-flash-preview-09-2025, google/gemini-2.5-flash-lite-preview-09-2025, deepseek/deepseek-chat-v3-0324 and deepseek/deepseek-chat-v3.1`).
- *Mode (Single and Bulk):* This option will be a switch button allowing user to only send one attachment for the task to be performed which will be either PDF, DOCX, TXT or MD in the Single mode. The Bulk mode will allow user to send upto 10 attachment for a given task.
- *Add File:* This option will open a preview modal just like (Add from Google Drive option in any application) in which it will show the Library Grid Preview so user can choose which file he wants to add by navigating to the particular folder. This Add File preview modal will also allow the user to upload the file as well if its not present in the Library. In this we'll reuse most of the components which contribute to the Library Page functionality, so we've to plan this very strategically.
- *Output Path:* This output path will actually allow the user to select the output path for the output file which will be sent by the Agent's workflow (there will be an HTTP node which will send the file to our backend API (selected S3 provider) which will save that file in the desired output path in the Library of our application). Here we've to strategically decide how its going to save it the configured provider as the Authentication will be set to none for testing but it'll be protected by CORS endpoint which will allow n8n workflow on Railway to save it to the S3 configured storage of the application.
vi) Now we've to decide what all things should be there in the payload with which we'll make the HTTP request to the webhook of n8n's workflow. Similar to that of Library Page there is a progress queue which opens up in the bootom-right hand side of the application which shows the uploading of files. We'll create the same queue mechanism and sweet alert via dialog or sonner for the task assigned and completion notification.


## Status Page (/status)
a) **Status Page** will be configured in the future.

## Settings Page (/settings)
a) **Settings Page** will be configured immediately after the completion of Connections Page.


# Functionalities and Dependencies
1) **Framework:** React 19 + TypeScript (strict mode)
2) **Build System:** Vite 7.1.7 with hot reload
3) **UI Library:** Shadcn/UI + Tailwind CSS
4) **State Management:** Zustand for theming, user preferences and state management throughout the application
5) **Theme System:** Dark/Light modes with smooth transitions

