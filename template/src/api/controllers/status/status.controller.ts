import express = require('express')

const statusController = {
    getStatus(req: express.Request, res: express.Response) {
        res.sendStatus(200)
    }
}

export default statusController
