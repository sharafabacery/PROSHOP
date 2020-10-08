const bcyrypt=require('bcryptjs')

const user = [
    {
        name: 'Admin user',
        email: 'admin@example.com',
        password: bcyrypt.hashSync('123456',10),
        isAdmin: true
    }, {
        name: 'John Doe',
        email: 'john@example.com',
        password: bcyrypt.hashSync('123456',10),
    }, {
        name: 'Jane user',
        email: 'jane@example.com',
        password: bcyrypt.hashSync('123456',10),
    }
]
module.exports=user