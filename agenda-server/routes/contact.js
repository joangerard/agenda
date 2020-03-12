var express = require('express');
var router = express.Router();
var orchestratorDI = require('../orchestrator-di');

/* GET contact listing. */
router.get('/all', async function(req, res, next)
{
	try
	{
		const contacts = await orchestratorDI.contactService.getAll();

		return res.json({ contacts: contacts });
	}
	catch(error)
	{
		// unexpected error
		return next(error);
	}
});

/* GET contact by uid */
router.get('/:id', async (req, res, next) =>
{
	try
	{
		const contact = await orchestratorDI.contactService.getById(req.params.id);

		return res.json({ contact });
	}
	catch(err)
	{
		if (err.name === 'InvalidParam') {
    	return res.status(400).json({ error: err.message });
		}

		if (err.name === 'NotFound') {
    	return res.status(404).json({ error: err.message });
		}

		// unexpected error
		return next(err.message);
	}
});

/* PUT a contact (edit)*/
router.put('/:id', async (req, res, next) =>
{
	try
	{
		const id = req.params.id;
		const data = req.body;

		await orchestratorDI.contactService.update(id, data);
		const contact = await orchestratorDI.contactService.getById(id);

		return res.json({ 'contact': contact });
	}
	catch(err)
	{
		if (err.name === 'InvalidParam') {
    	return res.status(400).json({ error: err.message });
		}

		if (err.name === 'ValidationError') {
    	return res.status(400).json({ error: err.message });
		}

		return next(err);
	}
});

/* POST a contact (add)*/
router.post('/', async (req, res, next) =>
{
	try
	{
		const data = req.body;
		const contact = await orchestratorDI.contactService.create(data);

		return res.json({contact});
	}
	catch(err)
	{
		if (err.name === 'InvalidParam') {
    	return res.status(400).json({ error: err.message });
		}

		if (err.name === 'ValidationError') {
    	return res.status(400).json({ error: err.message });
		}

		return next(err);
	}
});

module.exports = router;