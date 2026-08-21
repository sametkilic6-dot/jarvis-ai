// memory.js - JARVIS Memory Core v2
// LocalStorage tabanlı hafıza yönetimi

const Memory = (function() {
    const STORAGE_KEY = 'jarvis_memory_v3';
    const MAX_HISTORY = 1000;

    function getDefault() {
        return {
            data: [],
            profile: {
                name: null,
                preferences: {},
                facts: {},
                personal: {},
                goals: {}
            }
        };
    }

    function load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                const def = getDefault();
                for (let key in def) {
                    if (!(key in parsed)) parsed[key] = def[key];
                }
                for (let pkey in def.profile) {
                    if (!(pkey in parsed.profile)) parsed.profile[pkey] = def.profile[pkey];
                }
                return parsed;
            }
        } catch (e) {
            console.warn('Memory load error:', e);
        }
        return getDefault();
    }

    function save(memory) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
        } catch (e) {
            console.error('Memory save error:', e);
        }
    }

    let memory = load();

    function getMemory() {
        return memory;
    }

    function setMemory(newMem) {
        memory = newMem;
        save(memory);
    }

    function add(role, text) {
        if (!text || text.trim() === '') return;
        memory.data.push({ role: role.trim(), text: text.trim(), timestamp: Date.now() });
        if (memory.data.length > MAX_HISTORY) {
            memory.data = memory.data.slice(-MAX_HISTORY);
        }
        save(memory);
    }

    function setName(name) {
        if (name && name.trim() !== '') {
            memory.profile.name = name.trim();
            save(memory);
            return true;
        }
        return false;
    }

    function getName() {
        return memory.profile.name || null;
    }

    function addFact(key, value) {
        if (!key || key.trim() === '') return false;
        if (!value || value.trim() === '') return false;
        memory.profile.facts[key.trim()] = value.trim();
        save(memory);
        return true;
    }

    function getFact(key) {
        if (!key) return null;
        return memory.profile.facts[key.trim()] || null;
    }

    function removeFact(key) {
        if (!key) return false;
        if (key.trim() in memory.profile.facts) {
            delete memory.profile.facts[key.trim()];
            save(memory);
            return true;
        }
        return false;
    }

    function allFacts() {
        return { ...memory.profile.facts };
    }

    function addPreference(key, value) {
        if (!key || key.trim() === '') return false;
        if (!value || value.trim() === '') return false;
        memory.profile.preferences[key.trim()] = value.trim();
        save(memory);
        return true;
    }

    function getPreference(key) {
        if (!key) return null;
        return memory.profile.preferences[key.trim()] || null;
    }

    function removePreference(key) {
        if (!key) return false;
        if (key.trim() in memory.profile.preferences) {
            delete memory.profile.preferences[key.trim()];
            save(memory);
            return true;
        }
        return false;
    }

    function allPreferences() {
        return { ...memory.profile.preferences };
    }

    function addPersonal(key, value) {
        if (!key || key.trim() === '') return false;
        if (!value || value.trim() === '') return false;
        memory.profile.personal[key.trim()] = value.trim();
        save(memory);
        return true;
    }

    function getPersonal(key) {
        if (!key) return null;
        return memory.profile.personal[key.trim()] || null;
    }

    function removePersonal(key) {
        if (!key) return false;
        if (key.trim() in memory.profile.personal) {
            delete memory.profile.personal[key.trim()];
            save(memory);
            return true;
        }
        return false;
    }

    function allPersonal() {
        return { ...memory.profile.personal };
    }

    function addGoal(key, value) {
        if (!key || key.trim() === '') return false;
        if (!value || value.trim() === '') return false;
        memory.profile.goals[key.trim()] = value.trim();
        save(memory);
        return true;
    }

    function getGoal(key) {
        if (!key) return null;
        return memory.profile.goals[key.trim()] || null;
    }

    function removeGoal(key) {
        if (!key) return false;
        if (key.trim() in memory.profile.goals) {
            delete memory.profile.goals[key.trim()];
            save(memory);
            return true;
        }
        return false;
    }

    function allGoals() {
        return { ...memory.profile.goals };
    }

    function recent(limit = 10) {
        return memory.data.slice(-limit).reverse();
    }

    function search(query) {
        if (!query || query.trim() === '') return [];
        const q = query.trim().toLowerCase();
        return memory.data.filter(entry => 
            entry.text.toLowerCase().includes(q) || 
            entry.role.toLowerCase().includes(q)
        );
    }

    function getStats() {
        return {
            totalMessages: memory.data.length,
            userMessages: memory.data.filter(e => e.role === 'user').length,
            jarvisMessages: memory.data.filter(e => e.role === 'jarvis').length,
            profile: {
                name: memory.profile.name,
                factsCount: Object.keys(memory.profile.facts).length,
                preferencesCount: Object.keys(memory.profile.preferences).length,
                personalCount: Object.keys(memory.profile.personal).length,
                goalsCount: Object.keys(memory.profile.goals).length
            }
        };
    }

    function count() {
        return memory.data.length;
    }

    function clearConversation() {
        memory.data = [];
        save(memory);
    }

    function clearAll() {
        memory = getDefault();
        save(memory);
    }

    return {
        getMemory,
        setMemory,
        add,
        setName,
        getName,
        addFact,
        getFact,
        removeFact,
        allFacts,
        addPreference,
        getPreference,
        removePreference,
        allPreferences,
        addPersonal,
        getPersonal,
        removePersonal,
        allPersonal,
        addGoal,
        getGoal,
        removeGoal,
        allGoals,
        recent,
        search,
        getStats,
        count,
        clearConversation,
        clearAll
    };
})();

window.Memory = Memory;
