import { defineStore } from 'pinia'

const filters = {
    all: function (todos) {
        return todos;
    },
    active: function (todos) {
        return todos.filter(function (todo) {
            return !todo.done;
        });
    },
    completed: function (todos) {
        return todos.filter(function (todo) {
            return todo.done;
        });
    }
}
const createTodoItem = (message) => {
    return { id: new Date().getTime(), message, done: false }
}

//可以建立多個
export const usePiniaStore = (id = 'todo') => defineStore(id, {
    state: () => ({
        input: '',
        items: [],
        filter: 'all',
        editTarget: null
    }),
    getters: {
        itemsIndexMap() {
            return this.items.reduce(
                (result, item, index) => {
                    result[item.id] = index
                    return result
                }, {})
        },
        allDoneStatus() {
            return this.doneCount > 0 && this.doneCount === this.items.length
        },
        doneCount() {
            return this.items.reduce((result, item) => {
                if (item.done) result++
                return result
            }, 0)
        },
        displayItems() {
            return filters[this.filter](this.items)
        }
    },
    actions: {
        add() {
            if (!this.input) return false
            this.items.push(createTodoItem(this.input))
            this.input = ""
        },
        remove(id) {
            const index = this.itemsIndexMap[id]
            this.items.splice(index, 1)
        },
        removeCompleted() {
            this.items = filters['active'](this.items)
        },
        toggleAllDone() {
            const status = this.allDoneStatus ? false : true
            this.items.forEach((item) => {
                item.done = status
            })
        },
        edit(id) {
            this.editTarget = JSON.parse(JSON.stringify(this.items[this.itemsIndexMap[id]]))
        },
        editDone() {
            this.items[this.itemsIndexMap[this.editTarget.id]].message = this.editTarget.message
            this.editCancel()
        },
        editCancel() {
            this.editTarget = null
        }
    }
})()
