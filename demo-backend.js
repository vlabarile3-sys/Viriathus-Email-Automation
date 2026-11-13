(() => {
  const storageKey = 'viriathus-email-automation-demo-v1';
  const defaultState = {
    workflows: ['Demo_Agents'],
    agents: {
      Demo_Agents: [
        { id: 'jdoe123', name: 'John Doe', email: 'john.doe@example.com' },
        { id: 'asmith42', name: 'Alex Smith', email: 'alex.smith@example.com' },
        { id: 'mgarcia7', name: 'Morgan Garcia', email: 'morgan.garcia@example.com' }
      ]
    },
    templates: {
      'Offline Day Demo': {
        targetWorkflow: 'Demo_Agents',
        ccEmails: 'manager1@example.com, manager2@example.com',
        emailSubject: '{{AGENT_ID}} || Offline Day || {{DATE}}',
        driveFileId: '',
        destinationFolderId: '',
        emailBody: 'Hi Team,<br><br>This is to inform you that <strong>{{AGENT_NAME}}</strong> will be in Offline Day mode on <strong>{{DATE}}</strong>.<br><br>The agent will recap all the updates that we had during these days.<br>You can access the personalized plan by clicking here: <a href="{{FILE_URL}}">Offline Day File</a>.<br><br>In the afternoon, the agent will have shadowing / reverse shadowing with a colleague.<br><br>Please let me know if you have any questions or doubts.<br><br>Regards,'
      }
    },
    audit: []
  };
  const clone = value => JSON.parse(JSON.stringify(value));
  const savedState = JSON.parse(localStorage.getItem(storageKey) || 'null');
  const state = savedState
    ? { ...clone(defaultState), ...savedState }
    : clone(defaultState);

  const persist = () => localStorage.setItem(storageKey, JSON.stringify(state));
  const getAgents = workflow => state.agents[workflow] || [];
  const backend = {
    getInitialData: () => ({
      success: true,
      workflows: [...state.workflows],
      templates: clone(state.templates)
    }),

    getAuditHistory: () => clone(state.audit).reverse().slice(0, 100),

    getAgentsByWorkflow: workflow => clone(getAgents(workflow)),

    saveTemplate: (name, data) => {
      const cleanName = String(name || '').trim();
      if (!cleanName) return { success: false, error: 'Template name is required.' };
      state.templates[cleanName] = clone(data);
      persist();
      return {
        success: true,
        message: `Template ${cleanName} saved in this browser.`,
        templates: clone(state.templates)
      };
    },

    deleteTemplate: name => {
      if (!state.templates[name]) return { success: false, error: 'Template not found.' };
      delete state.templates[name];
      if (Object.keys(state.templates).length === 0) {
        state.templates = clone(defaultState.templates);
      }
      persist();
      return {
        success: true,
        message: 'Template deleted from this browser.',
        templates: clone(state.templates)
      };
    },

    createWorkflow: name => {
      const cleanName = String(name || '').trim();
      if (!cleanName) return { success: false, error: 'Workflow name cannot be empty.' };
      if (state.workflows.includes(cleanName)) {
        return { success: false, message: `Workflow ${cleanName} already exists.` };
      }
      state.workflows.push(cleanName);
      state.agents[cleanName] = [];
      persist();
      return {
        success: true,
        message: `Workflow ${cleanName} created in this browser.`,
        workflows: [...state.workflows]
      };
    },

    addAgentsBulk: (agentsString, workflow) => {
      const agents = getAgents(workflow);
      const knownIds = new Set(agents.map(agent => agent.id));
      const added = String(agentsString || '')
        .split(',')
        .map(id => id.trim())
        .filter(id => id && !knownIds.has(id));
      added.forEach(id => agents.push({ id, name: id, email: `${id}@example.com` }));
      persist();
      return { success: true, message: `Added ${added.length} demo agent(s).` };
    },

    deleteAgentsBatch: (agentIds, workflow) => {
      const agents = getAgents(workflow);
      const selected = new Set(agentIds || []);
      const remaining = agents.filter(agent => !selected.has(agent.id));
      const deletedCount = agents.length - remaining.length;
      state.agents[workflow] = remaining;
      persist();
      return {
        success: true,
        message: `Successfully removed ${deletedCount} demo agent(s).`
      };
    },

    fetchAgentThreadsForWizard: (workflow, agentIds) => {
      const agents = getAgents(workflow);
      const threadsMap = {};
      agentIds.forEach(id => {
        if (agents.some(agent => agent.id === id)) {
          threadsMap[id] = [{
            id: `demo-thread-${id}`,
            subject: 'Offline Day planning discussion',
            date: '12 Nov 10:30'
          }];
        } else {
          threadsMap[id] = [];
        }
      });
      return { success: true, threadsMap };
    },

    generateSingleDraft: (workflow, agentId, date, templateData, threadId) => {
      const agent = getAgents(workflow).find(item => item.id === agentId);
      if (!agent) throw new Error(`Demo agent ${agentId} was not found.`);
      state.audit.push({
        timestamp: new Date().toLocaleString(),
        agentName: agent.name,
        workflow,
        targetDate: date,
        action: threadId && threadId !== 'NEW'
          ? 'EXPLICIT REPLY SIMULATED (DEMO)'
          : 'NEW DRAFT SIMULATED (DEMO)'
      });
      persist();
      return { success: true, url: '' };
    }
  };

  const createRunner = () => {
    let successHandler;
    let failureHandler;
    const runner = new Proxy({}, {
      get(_target, property) {
        if (property === 'withSuccessHandler') {
          return callback => {
            successHandler = callback;
            return runner;
          };
        }
        if (property === 'withFailureHandler') {
          return callback => {
            failureHandler = callback;
            return runner;
          };
        }
        if (property === 'then') return undefined;
        return (...args) => {
          Promise.resolve()
            .then(() => {
              const method = backend[property];
              if (typeof method !== 'function') {
                throw new Error(`Unsupported demo operation: ${String(property)}`);
              }
              return method(...args);
            })
            .then(
              result => successHandler?.(result),
              error => {
                if (failureHandler) failureHandler(error);
                else console.error('Demo operation failed:', error);
              }
            );
          return runner;
        };
      }
    });
    return runner;
  };

  globalThis.google = {
    script: {
      get run() {
        return createRunner();
      }
    }
  };
})();
