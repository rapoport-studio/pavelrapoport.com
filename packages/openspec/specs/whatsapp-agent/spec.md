# whatsapp-agent

> WhatsApp-based AI agent for task creation and client communication.

## Purpose

**What:** A pipeline that receives WhatsApp messages, processes
them through Claude as "Digital Pavel", creates Linear tasks
when needed, and replies via WhatsApp.

**For whom:** Pavel (receives tasks and client messages via
WhatsApp), clients and collaborators (communicate with the
studio through WhatsApp).

**Why it exists:** WhatsApp is where conversations happen.
Instead of switching to Linear or the studio dashboard to
create tasks, Pavel sends a message and the agent handles it.
The pipeline also serves as a client communication channel
where the AI qualifies requests before escalating to Pavel.

## Requirements

### Requirement: Message Pipeline Architecture

The WhatsApp agent SHALL follow this pipeline:
WhatsApp → Meta Cloud API → n8n → studio endpoint →
Claude → Linear → WhatsApp reply.

#### Scenario: Incoming message with task intent
- **GIVEN** a user sends a WhatsApp message containing a task
- **WHEN** the message reaches the studio endpoint
- **THEN** Claude processes it and identifies the task
- **AND** a Linear issue is created with title, description, priority, labels
- **AND** a confirmation reply is sent back to WhatsApp

#### Scenario: Incoming conversational message
- **GIVEN** a user sends a WhatsApp message without task intent
- **WHEN** the message reaches the studio endpoint
- **THEN** Claude responds conversationally as Digital Pavel
- **AND** no Linear issue is created
- **AND** the reply is sent back to WhatsApp

### Requirement: Meta Business Configuration

The system SHALL use Meta Business platform with:
- App ID: `989302493566397`
- WABA ID: `1289448895881529`
- Test phone number ID: `1110362835486330`

#### Scenario: Webhook verification
- **GIVEN** Meta needs to verify the webhook endpoint
- **WHEN** Meta sends a GET with a challenge token
- **THEN** the n8n trigger node responds with the challenge token
- **AND** the webhook is verified

#### Scenario: Message reception
- **GIVEN** a WhatsApp message is sent to the registered number
- **WHEN** Meta Cloud API processes it
- **THEN** it delivers a webhook to the n8n trigger URL
- **AND** the payload includes sender phone, message text, and timestamp

### Requirement: n8n Workflow

The n8n instance at `ai-development-studio.app.n8n.cloud`
SHALL run a 3-node workflow:
1. **Trigger** — WhatsApp webhook receiver
2. **HTTP Request** — POST to studio endpoint
3. **Send Message** — reply via Meta Cloud API

#### Scenario: Workflow execution
- **GIVEN** the n8n workflow is active
- **WHEN** the trigger node receives a WhatsApp webhook
- **THEN** the HTTP Request node sends the message to `POST /api/studio/command`
- **AND** the Send Message node delivers Claude's response to WhatsApp

#### Scenario: Body format for HTTP Request
- **GIVEN** the n8n HTTP Request node is configured
- **WHEN** passing dynamic values to the studio endpoint
- **THEN** the body MUST use "Using Fields Below" mode
- **AND** MUST NOT use "Using JSON" mode (expressions do not resolve in JSON mode)

### Requirement: Studio Endpoint

The studio SHALL expose `POST /api/studio/command` authenticated
via `x-api-key` header.

#### Scenario: Authenticated request
- **GIVEN** a POST arrives at `/api/studio/command`
- **WHEN** the `x-api-key` header matches the stored key
- **THEN** the message is forwarded to Claude for processing
- **AND** the response is returned as JSON

#### Scenario: Unauthorized request
- **GIVEN** a POST arrives at `/api/studio/command`
- **WHEN** the `x-api-key` header is missing or invalid
- **THEN** the system returns 401 Unauthorized
- **AND** the request is not processed

### Requirement: Agent Behavior

The Claude agent SHALL operate as "Digital Pavel" with these
constraints:
- Detect message language and respond in the same language
- Limit responses to 500 characters (WhatsApp readability)
- Return task creation data in structured JSON format
- Maintain the Digital Pavel personality defined in the system prompt

#### Scenario: Language detection
- **GIVEN** a message arrives in Russian
- **WHEN** Claude processes the message
- **THEN** Claude responds in Russian

#### Scenario: Task detection and JSON output
- **GIVEN** a message contains a task intent
- **WHEN** Claude identifies the task
- **THEN** it returns a JSON object with: `title`, `description`, `priority`, `labels`
- **AND** the JSON is used to create a Linear issue

#### Scenario: Response length limit
- **GIVEN** Claude generates a response
- **WHEN** the response is prepared for WhatsApp delivery
- **THEN** it MUST NOT exceed 500 characters
- **AND** the response is concise and actionable

### Requirement: Linear Integration

Task creation SHALL use the Linear API via `@linear/sdk`:
- Team ID: `ffb2de5f`
- Project ID: `92833011`

#### Scenario: Creating a task from WhatsApp
- **GIVEN** Claude has identified a task in the message
- **WHEN** the system creates the issue
- **THEN** `createIssue` is called with team, project, title, description, priority, and labels
- **AND** the issue URL is included in the WhatsApp reply

#### Scenario: Task confirmation reply
- **GIVEN** a Linear issue is created successfully
- **WHEN** the reply is composed
- **THEN** the WhatsApp reply includes the issue identifier
- **AND** a short confirmation message

### Requirement: Known Issue — JSON Code Fences

Claude MAY wrap JSON output in markdown code fences
(`` ```json ... ``` ``). The system MUST strip code fences
before parsing JSON.

#### Scenario: Code fence stripping
- **GIVEN** Claude returns a response containing `` ```json ``
- **WHEN** the system prepares to parse the JSON
- **THEN** it strips the opening and closing code fences
- **AND** parses the remaining content as valid JSON

### Requirement: Known Issue — n8n Expression Resolution

n8n "Using JSON" body mode does NOT resolve expressions.
The HTTP Request node MUST use "Using Fields Below" mode
to pass dynamic values.

#### Scenario: Correct n8n configuration
- **GIVEN** the n8n HTTP Request node needs to send dynamic data
- **WHEN** the body mode is configured
- **THEN** it is set to "Using Fields Below"
- **AND** each field maps an expression to the request body
- **AND** expressions resolve correctly at runtime

### Requirement: Remaining Capabilities (Planned)

The following capabilities are planned but not yet implemented:
- Production WhatsApp number (currently using test number)
- Voice message transcription and processing
- Task status queries via WhatsApp

#### Scenario: Production number migration
- **GIVEN** a production WhatsApp number is provisioned
- **WHEN** the Meta Business configuration is updated
- **THEN** the new phone number ID replaces the test number
- **AND** the n8n webhook continues to function without workflow changes

## Entities

- **Message** — an incoming WhatsApp message.
  Has: sender phone, text, timestamp, language
- **AgentResponse** — Claude's processed response.
  Has: reply text, task JSON (optional), language
- **Task** — a Linear issue created from a message.
  Has: title, description, priority, labels, issue URL,
  team ID, project ID
- **Workflow** — the n8n 3-node automation.
  Has: trigger URL, endpoint URL, Meta send config
- **Endpoint** — the studio API route.
  Has: path (`/api/studio/command`), auth method (`x-api-key`)

## Dependencies

- `studio` — hosts the `/api/studio/command` endpoint
- `ai` — Claude agent processes messages, Digital Pavel personality
- `tasks` — Linear issue creation for detected tasks
- `integrations` — WhatsApp Business API and Linear are registered integrations
