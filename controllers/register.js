const handleRegister = (db, bcrypt) => (req, res) => {
    const { name, email, password } = req.body;
    console.log('Register request body:', req.body);

    if (!email || !name || !password) {
        console.log('Missing fields:', { name, email, password });
        return res.status(400).json('Incorrect form submission');
    }

    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('*')
        .then(loginEmail => {
            console.log('Inserted into login table:', loginEmail);
            return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0].email,
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                    console.log('Inserted into users table:', user[0]);
                    res.json(user[0]);
                });
        })
        .then(trx.commit)
        .catch(err => {
            trx.rollback();
            console.error('Transaction error:', err);
            res.status(400).json('Unable to register.');
        });
    })
    .catch(err => {
        console.error('DB connection or transaction setup error:', err);
        res.status(400).json('Unable to register.');
    });
}

module.exports = {
    handleRegister
};
