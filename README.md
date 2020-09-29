# RBank demo ÐApp
This is a demo on how to integrate [RBank library][1] into a Vue.js project.

| ![Admin](./src/assets/readme/admin.jpeg) | ![My Activity](./src/assets/readme/my_activity.jpeg) |
| --- | --- |
| ![Transaction history](./src/assets/readme/TXhistory.jpeg) | ![Supply / Borrow](./src/assets/readme/supply_borrow.jpeg) |

## Requirements
 * Docker ^19.0.3
 * Docker compose ^1.25.4
 * Deploy a [RBank controller][2]

## Usage
In `docker-compose.yml` modify `RBANK_CONTROLLER` with the address of your RBank controller contract.

Then run the docker container.
```bash
docker-compose up
```

Then access the ÐApp in your browser at the given url (<https://localhost> by default)

[1]: https://www.npmjs.com/package/@rsksmart/rbank
[2]: https://github.com/rsksmart/DeFiProt
