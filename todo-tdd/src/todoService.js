class TodoService {
    constructor({ todoRepository }) {
        this.todoRepository = todoRepository
    }

    create(todoItem) {
        if(!todoItem.isValid()) {
            return {
                error: {
                    message: 'invalid data',
                    data: todoItem
                }
            }
        }

        const today = new Date()

        const todo = {
            ...todoItem,
            status: todoItem.when > today ? 'pending' : 'late'
        }

        return this.todoRepository.create(todo)
    }

    list() {
        const results = this.todoRepository.list()
        return results.map(({ meta, $loki, ...result }) => result)
    }
}

module.exports = TodoService