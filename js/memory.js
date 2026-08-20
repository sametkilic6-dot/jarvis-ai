"use strict";

const Memory = {

    key: "jarvis_memory",

    data: [],

    init() {
        try {
            const saved = localStorage.getItem(this.key);

            if (saved) {
                const parsed = JSON.parse(saved);

                if (Array.isArray(parsed)) {
                    this.data = parsed;
                }
            }
        } catch (error) {
            console.error("JARVIS Memory yüklenemedi:", error);
            this.data = [];
        }
    },

    add(role, text) {
        if (!text || !text.trim()) {
            return;
        }

        this.data.push({
            role: role,
            text: text.trim(),
            timestamp: new Date().toISOString()
        });

        if (this.data.length > 500) {
            this.data = this.data.slice(-500);
        }

        this.save();
    },

    recent(limit = 10) {
        return this.data.slice(-limit);
    },

    search(query) {
        if (!query) {
            return [];
        }

        const text = query.toLowerCase();

        return this.data.filter(item =>
            item.text.toLowerCase().includes(text)
        );
    },

    count() {
        return this.data.length;
    },

    clear() {
        this.data = [];
        this.save();
    },

    save() {
        try {
            localStorage.setItem(
                this.key,
                JSON.stringify(this.data)
            );
        } catch (error) {
            console.error(
                "JARVIS Memory kayıt hatası:",
                error
            );
        }
    }
};

Memory.init();

console.log("🧠 JARVIS Memory aktif.");
