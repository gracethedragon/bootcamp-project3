export default function initItemsController(db) {
  const index = (request, response) => {
    db.Item.findAll()
      .then((items) => {
        response.send({ items });
      })
      .catch((error) => console.log(error));
  };

  return {
    index,
  };
}
