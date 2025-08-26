const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc');

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set('authorization', 'Key 6f795d0982164d5f8934a98788da605e');

const handleApiCall = (req, res) => {
  const { input } = req.body;
  if (!input) return res.status(400).json('No image URL provided');

  stub.PostModelOutputs(
    {
      user_app_id: {
        user_id: 'clarifai',
        app_id: 'main'
      },
      model_id: 'face-detection',
      inputs: [{ data: { image: { url: input } } }]
    },
    metadata,
    (err, response) => {
      if (err) return res.status(400).json('Error: ' + err);
      if (response.status.code !== 10000) {
        return res.status(400).json(response.status.description);
      }
      res.json(response);
    }
  );
};

const handleImage = (db) => (req, res) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0].entries))
    .catch(err => res.status(400).json('Unable to get entries.'));
};

module.exports = { handleImage, handleApiCall };