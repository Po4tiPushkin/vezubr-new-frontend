export function formatOffer(offerDirty) {
  const offer = {
    ...offerDirty,
  };

  offer.updatedAt = offerDirty.uppdatedAt || offerDirty.updatedAt;

  if (offerDirty.producer) {
    offer.producer = formatOfferProducer(offerDirty.producer);
  }

  return offer;
}

export function formatOfferProducer(producerDirty) {
  const producer = {
    ...producerDirty,
  };

  producer.logoFileId = producerDirty?.logoFile?.fileId || producerDirty?.logoFile_doc?.id;

  producer.companyFullName = producerDirty.companyFullName || producerDirty.company_full_name;
  producer.companyShortName = producerDirty.companyShortName || producerDirty.company_name;

  return producer;
}
