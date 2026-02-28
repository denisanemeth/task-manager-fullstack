// schema si model pentru tasks

const mongoose = require('mongoose');

//schema pt tasks

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title este obligatoriu'],
            trim: true,//elimina spatii de la inceput,sfarsit
            minlength: [3, 'Title trebuie sa aiba minim 3 caractere'],
            maxlength: [200, 'Title nu poate depasi 200 de caractere']
        },
        status: {//starea task ului
            type: String,
            enum: {
                values: ['todo', 'in-progress', 'done'],
                message: 'Status trebuie sa fie : todo,in-progres sau done'
            },
            default: 'todo'

        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, 'Descrierea nu poate depasi 1000 de caractere'],
            default: ''//este optionala

        }, userId: {//cui apartine task ul
            type: mongoose.Schema.Types.ObjectId,//referinta la un user
            ref: 'User',
            required: [true, 'userId este obligatoriu']


        },
        dueDate: {
            type: Date,
            default: null//optional

        }
    }, {
    timestamps: true//createdAt,updatedAt
}
);
const Task = mongoose.model('Task', taskSchema);
module.exports = Task;