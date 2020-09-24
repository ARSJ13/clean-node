const express = require('express');
const router = express.Router();

module.exports = () => {
  const router = new SigUpRouter()
  router.post('/sigup', ExpressRouterAdapter.adapt(router))
}

class ExpressRouterAdapter {
  static adapt (router) {
    return async (req, res) => {
      const httpRequest = {
        body: req.body
      }
      const httpResponse = await router.route(httpRequest)
      res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}

// ROUTERS
class SigUpRouter {
  async route (httpRequest) {
    const {email, password, repeatPassword} = httpRequest.body;
    const user = new SigUpUseCase().sigUp(email, password, repeatPassword);
    return {
      statusCode: 200,
      body: user
    }
  }
}

// USECASE
class SigUpUseCase {
  async sigUp(email, password, repeatPassword){
    if(password===repeatPassword){
      new AddAccountRepository().add(email, password)  
    }
  }
}

// ADD-ACCOUNT
const mongoose = require('mongoose');
const AccountModel = mongoose.model('Account');

class AddAccountRepository {
  async add (email, password){
    const user = await AccountModel.create({email, password})
    return user
  }
}

