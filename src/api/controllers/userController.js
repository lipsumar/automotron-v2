import { Router } from 'express';
import userService from '../services/userService';

const router = new Router();

router.get('/', async (req, res) => {
  const users = await userService.findAll();
  res.send(
    users.map(user => {
      return {
        _id: user._id.toString(),
        email: user.email,
        role: user.role,
        username: user.username,
      };
    }),
  );
});

router.get('/:id', async (req, res) => {
  const user = await userService.get(req.params.id);
  res.send(user);
});

module.exports = router;
