async function main () {
  const Company = await ethers.getContractFactory('Company');
  console.log('Deploying Token...');
  const company = await Company.deploy(temporaryMaxPublic, adminAddresses);
  await company.deployed();
  const address = company.address;
  console.log('Token deployed to:', address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });