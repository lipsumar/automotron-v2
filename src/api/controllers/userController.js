import { Router } from 'express';
import userService from '../services/userService';

const router = new Router();

router.get('/', async (req, res) => {
  const users = await userService.findAll();
  res.send(
    users.map(generator => {
      return {
        _id: generator._id.toString(),
        username: generator.username,
        role: generator.role,
      };
    }),
  );
});

router.get('/:id', async (req, res) => {
  const user = await userService.get(req.params.id);
  res.send(user);
});

module.exports = router;
