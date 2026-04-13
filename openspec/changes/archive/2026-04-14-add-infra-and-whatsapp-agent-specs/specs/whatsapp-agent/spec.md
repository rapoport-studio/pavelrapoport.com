## ADDED Requirements

### Requirement: Message Pipeline Architecture

The WhatsApp agent SHALL follow this pipeline:
WhatsApp → Meta Cloud API → n8n → studio endpoint → Claude → Linear → WhatsApp reply.

#### Scenario: Incoming message flow
- **WHEN** a user sends a WhatsApp message
- **THEN** Meta Cloud API delivers the webhook to n8n
- **AND** n8n forwards the message to the studio endpoint
- **AND** Claude processes the message and generates a response
- **AND** if a task is detected, a Linear issue is created
- **AND** the reply is sent back through n8n to WhatsApp

#### Scenario: Non-task message
- **WHEN** a user sends a conversational message (no task intent)
- **THEN** Claude responds conversationally
- **AND** no Linear issue is created
- **AND** the reply is sent back to WhatsApp

### Requirement: Meta Business Configuration

The system SHALL use Meta Business platform with:
- App ID: `989302493566397`
- WABA ID: `1289448895881529`
- Test phone number ID: `1110362835486330`

#### Scenario: Webhook verification
- **WHEN** Meta sends a webhook verification challenge
- **THEN** the n8n trigger node responds with the challenge token
- **AND** the webhook is verified

#### Scenario: Message reception
- **WHEN** a WhatsApp message arrives
- **THEN** Meta Cloud API delivers it to the n8n webhook URL
- **AND** the payload includes sender phone, message text, and timestamp

### Requirement: n8n Workflow

The n8n instance at `ai-development-studio.app.n8n.cloud` SHALL run a 3-node workflow:
1. **Trigger** — WhatsApp webhook receiver
2. **HTTP Request** — POST to studio endpoint
3. **Send Message** — reply via Meta Cloud API

#### Scenario: Workflow execution
- **WHEN** the trigger node receives a WhatsApp webhook
- **THEN** the HTTP Request node sends the message to `POST /api/studio/command`
- **AND** the Send Message node delivers Claude's response back to WhatsApp

#### Scenario: Body format for HTTP Request
- **WHEN** configuring the n8n HTTP Request node
- **THEN** the body MUST use "Using Fields Below" mode
- **AND** MUST NOT use "Using JSON" mode (expressions do not resolve in JSON mode)

### Requirement: Studio Endpoint

The studio SHALL expose `POST /api/studio/command` authenticated via `x-api-key` header.

#### Scenario: Authenticated request
- **WHEN** a POST arrives at `/api/studio/command` with valid `x-api-key`
- **THEN** the message is forwarded to Claude for processing
- **AND** the response is returned as JSON

#### Scenario: Unauthorized request
- **WHEN** a POST arrives without `x-api-key` or with an invalid key
- **THEN** the system returns 401 Unauthorized
- **AND** the request is not processed

### Requirement: Agent Behavior

The Claude agent SHALL operate as "Digital Pavel" with the following constraints:
- Detect message language and respond in the same language
- Limit responses to 500 characters (WhatsApp readability)
- Return task creation data in structured JSON format
- Maintain the Digital Pavel personality defined in the system prompt

#### Scenario: Language detection
- **WHEN** a message arrives in Russian
- **THEN** Claude responds in Russian

#### Scenario: Task detection and JSON output
- **WHEN** a message contains a task intent (e.g., "добавь задачу: ...")
- **THEN** Claude returns a JSON object with: `title`, `description`, `priority`, `labels`
- **AND** the JSON is used to create a Linear issue

#### Scenario: Response length limit
- **WHEN** Claude generates a response
- **THEN** the response MUST NOT exceed 500 characters
- **AND** the response is concise and actionable

### Requirement: Linear Integration

Task creation SHALL use the Linear API via `@linear/sdk`:
- Team ID: `ffb2de5f`
- Project ID: `92833011`

#### Scenario: Creating a task from WhatsApp
- **WHEN** Claude identifies a task in the message
- **THEN** `createIssue` is called with team, project, title, description, priority, and labels
- **AND** the issue URL is included in the WhatsApp reply

#### Scenario: Task confirmation reply
- **WHEN** a Linear issue is created successfully
- **THEN** the WhatsApp reply includes the issue identifier and a confirmation message

### Requirement: Known Issue — JSON Code Fences

Claude MAY wrap JSON output in markdown code fences (`` ```json ... ``` ``). The system MUST strip code fences before parsing JSON.

#### Scenario: Code fence stripping
- **WHEN** Claude returns a response containing `` ```json ``
- **THEN** the system strips the opening and closing code fences
- **AND** parses the remaining content as JSON

### Requirement: Known Issue — n8n Expression Resolution

n8n "Using JSON" body mode does NOT resolve expressions. The HTTP Request node MUST use "Using Fields Below" mode to pass dynamic values.

#### Scenario: Correct n8n configuration
- **WHEN** the n8n HTTP Request node is configured
- **THEN** the body mode is set to "Using Fields Below"
- **AND** each field maps an expression to the request body
- **AND** expressions resolve correctly at runtime

### Requirement: Remaining Capabilities (Not Yet Implemented)

The following capabilities are planned but not yet implemented:
- Production WhatsApp number (currently using test number)
- Voice message support
- Task status queries via WhatsApp

#### Scenario: Production number migration
- **WHEN** a production WhatsApp number is provisioned
- **THEN** the Meta Business configuration is updated with the new phone number ID
- **AND** the n8n webhook continues to function without workflow changes
