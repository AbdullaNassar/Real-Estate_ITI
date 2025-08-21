import { Helmet } from "react-helmet";

const SEO = ({ title, description }) => {
  const defaultTitle = "Maskn | Rent Homes Across Egypt";
  const defaultDescription =
    "Find and book apartments, villas, and unique stays across Egypt with Maskn.";

  return (
    <Helmet>
      <title>{title || defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta
        name="keywords"
        content="rent homes Egypt, apartments Egypt, Maskn rentals"
      />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content={title || defaultTitle} />
      <meta
        property="og:description"
        content={description || defaultDescription}
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Maskn" />
    </Helmet>
  );
};

export default SEO;
