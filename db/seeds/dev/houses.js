let housesData = [
  {
    address: '1975 Hacienda Pl, Stevensville, MI 49127',
    built: 1923,
    ghosts: [{ name: 'Old Mank', type: 'ghost' }, { name: 'Hector', type: 'poltergeist' }]
  },
  {
    address: '7597 Bittersweet Dr, Gurnee, IL 60031',
    built: 2002,
    ghosts: [{ name: 'Eliza', type: 'ghost' }, { name: 'Brahms', type: 'shadow' }]
  },
  {
    address: '1201 Columbine St, Denver, CO 80206',
    built: 1976,
    ghosts: [{ name: 'Calamity', type: 'poltergeist' }, { name: 'Inky', type: 'shadow' }, { name: 'Mac', type: 'ghost' }]
  }
];

const createHouse = (knex, house) => {
  return knex('houses').insert({
    address: house.address,
    built: house.built
  }, 'id')
  .then(houseId => {
    let ghostPromises = [];

    house.ghosts.forEach(ghost => {
      ghostPromises.push(
        createGhost(knex, {
          name: ghost.name,
          type: ghost.type,
          house_id: houseId[0]
        })
      )
    });

    return Promise.all(ghostPromises);
  })
};

const createGhost = (knex, ghost) => {
  return knex('ghosts').insert(ghost);
};

exports.seed = (knex, Promise) => {
  return knex('ghosts').del() // delete ghosts first
    .then(() => knex('houses').del()) // delete all houses
    .then(() => {
      let housePromises = [];

      housesData.forEach(house => {
        housePromises.push(createHouse(knex, house));
      });

      return Promise.all(housePromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
