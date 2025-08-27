const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc');

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
if (!process.env.CLARIFAI_PAT) {
  console.error('Missing CLARIFAI_PAT env var');
}
metadata.set('authorization', `Key ${process.env.CLARIFAI_PAT}`);

const handleApiCall = (req, res) => {
  const { input } = req.body;
  if (!input) return res.status(400).json('No image URL provided');

  const userAppId = {
    user_id: process.env.CLARIFAI_USER_ID || 'clarifai',
    app_id: process.env.CLARIFAI_APP_ID || 'main'
  };

  stub.PostModelOutputs(
    {
      user_app_id: userAppId,
      model_id: 'face-detection',
      inputs: [{ data: { image: { url: input } } }]
    },
    metadata,
    (err, response) => {
      if (err) {
        console.error('Clarifai error:', err);
        return res.status(400).json('Error: ' + (err.message || err.toString()));
      }
      if (!response || response.status.code !== 10000) {
        const msg = response ? response.status.description : 'Invalid response';
        console.error('Clarifai status error:', response);
        return res.status(400).json(msg);
      }
      return res.json(response);}
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