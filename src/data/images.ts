/** Property & locality imagery for DisplayAvenue Realty */
const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const img = {
  heroLocal: u("photo-1600596542815-ffad4c1539a9", 1600),
  heroAlt: u("photo-1600585154340-be6161a56a0c", 1600),
  apartmentLiving: u("photo-1502672260266-1c1ef2d93688"),
  apartmentModern: u("photo-1560448204-e02f11c3d0e2"),
  apartmentBright: u("photo-1522708323590-d24dbb6b0267"),
  apartmentKitchen: u("photo-1556912173-46c336c7fd55"),
  apartmentBedroom: u("photo-1616594039964-ae9021a400a0"),
  apartmentBalcony: u("photo-1493809842364-78817add7ffb"),
  societyExterior: u("photo-1545324418-cc1a3fa10c00"),
  highrise: u("photo-1486406146926-c627a92ad1ab"),
  mumbaiSkyline: u("photo-1564501049412-61c2a3083791"),
  miraRoadFeel: u("photo-1605649487212-47bdab064df7"),
  shopFront: u("photo-1441986300917-64674bd600d8"),
  officeSpace: u("photo-1497366216548-37526070297c"),
  officeModern: u("photo-1497366811353-6870744d04b2"),
  warehouse: u("photo-1586528116311-ad8dd3c8310d"),
  redevelopment: u("photo-1503387762-592deb58ef4e"),
  construction: u("photo-1541888946425-d81bb19240f5"),
  familyHome: u("photo-1570129477492-45c003edd2be"),
  luxuryInterior: u("photo-1600607687939-ce8a6c25118c"),
  floorPlanStyle: u("photo-1503387762-592deb58ef4e"),
  teamOffice: u("photo-1600880292203-757bb62b4baf"),
  handshake: u("photo-1560518883-ce09059eeffa"),
  keys: u("photo-1560518883-ce09059eeffa"),
  valuation: u("photo-1554224155-6726b3ff858f"),
  blogMarket: u("photo-1560518883-ce09059eeffa"),
  blogDocs: u("photo-1450101499163-c8848c66ca85"),
  blogCompare: u("photo-1486406146926-c627a92ad1ab"),
  mapPin: u("photo-1524661135-423995f22d0b"),
  defaultProperty: u("photo-1560448204-e02f11c3d0e2"),
};

export const propertyGallery = {
  flatA: [
    img.apartmentModern,
    img.apartmentLiving,
    img.apartmentKitchen,
    img.apartmentBedroom,
    img.apartmentBalcony,
  ],
  flatB: [
    img.apartmentBright,
    img.apartmentLiving,
    img.luxuryInterior,
    img.apartmentKitchen,
    img.societyExterior,
  ],
  flatC: [
    img.familyHome,
    img.apartmentLiving,
    img.apartmentBedroom,
    img.apartmentBalcony,
    img.apartmentKitchen,
  ],
  commercialA: [img.shopFront, img.officeSpace, img.officeModern],
  commercialB: [img.officeModern, img.officeSpace, img.highrise],
  warehouseA: [img.warehouse, img.officeSpace, img.construction],
};
