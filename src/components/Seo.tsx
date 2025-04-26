import { Helmet } from "react-helmet";

type SeoProps = {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    author?: string;
    keywords?: string;
};

export const Seo = ({
    title,
    description,
    image,
    url,
    author,
    keywords,
}: SeoProps) => {
    const defaultTitle = 'Uptask - Crea y Administra tus Proyectos';
    const defaultDescription =
        'Administra tus proyectos de forma sencilla y eficiente con Uptask. Crea tareas, asigna miembros y mantén todo organizado.';
    const defaultImage = 'https://raulqd-uptask.netlify.app/logo.svg'; // Cambia esto por la URL de tu imagen por defecto
    const defaultUrl = 'https://raulqd-uptask.netlify.app'; // Cambia esto por la URL de tu sitio
    const defaultAuthor = 'Raul Quispe'; // Cambia esto por el nombre de tu autor
    const seo = {
        title: title || defaultTitle,
        description: description || defaultDescription,
        image: image || defaultImage,
        url: url || defaultUrl,
        author: author || defaultAuthor,
    };
    return (
      <Helmet>
         {/*Metadatos básicos*/}
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={keywords} />
        {/*Metadatos para robots */}
        <meta name="robots" content="index, follow" />
        {/*Metadatos para Open Graph*/}
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:image" content={seo.image} />
        <meta property="og:url" content={seo.url} />
        <meta property="og:type" content='website' />
        {/*Metadatos para Twitter*/}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content={seo.image} />
        {/*Metadatos adicionales*/} 
        <meta name="author" content={seo.author} />

      </Helmet>
    );
};
