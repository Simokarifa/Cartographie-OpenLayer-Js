                                    /** Les données **/
// Objet geojson des départements de l'Ile-de-France
var departements = JSON.parse(departementsJson);
// Objet geojson des routes de l'Ile-de-France
var routes = JSON.parse(routesJson);

/**
 * initialisation la carte openlayers =================================
 **/
const map = new ol.Map({
    // l'id de l'element html de la carte
    target: "map",
    // les couches de la carte
    layers: [
        // premiere couche : Nouvelle couche tuilée OSM
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    // la vue initiale de la carte: centre de l'Europe en WGS84
    view: new ol.View({
        center: ol.proj.fromLonLat([2.1281018, 48.6931363]),
        zoom: 8.0
    }),
    // Tableau des contrôles de la carte
    controls: ol.control.defaults().extend([
        // Plein-écran
        new ol.control.FullScreen(),
        // Echelle
        new ol.control.ScaleLine(),
        // position du curseur
        new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(2),
            projection: "EPSG:4326",
            className: "",
            target: document.getElementById("mouse-position")
        })
    ])
});


/**
 * Transformation et ajout de la couche geojson des departements de l'Ile de france=======================
 **/
var features = new ol.format.GeoJSON().readFeatures(departements, {
    featureProjection: "EPSG:3857"
});
// Créer une source de données de type vecteur
var source = new ol.source.Vector({
    // la liste des features
    features: features
});

//Creation d'une fonction style pour les departements
var styleFunction = function (feature) {
    // on récupére la propriété 'code_dept'
    var featureId = feature.get("code_dept");

    // Correspondance code_dept -> couleur
    var colors = {
        77: [56, 107, 201, 0.2],
        78: [195, 235, 21, 0.2],
        94: [56, 186, 56, 0.2],
        92: [173, 244, 42, 0.2],
        75: [174, 46, 245, 0.2],
        95: [105, 45, 243, 0.2],
        91: [177, 147, 41, 0.2],
        93: [178, 248, 249, 0.2]
    };

    // la couleur qui correspond à l'code_dept
    var featureColor = colors[featureId];
    // Vérifier si featureColor n'existe pas. càd, différente de: undefined, null, 0 et "" (Une chaîne de caractères vide)
    // Si la couleur n'existe pas => utiliser une couleur par défaut
    if (!featureColor) {
        featureColor = "gray";
    }

    // retourner un objet de type Style
    return new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "black",
            width: 1
        }),
        fill: new ol.style.Fill({
            color: featureColor
        })
    });
};

var depLayer = new ol.layer.Vector({
    id: "departement",
    source: source,
    style: styleFunction,
})

// couche invisible au démarrage
depLayer.setVisible(false);

// ajouter la couche à la carte
var depCheckBox = document.getElementById('departement');
depCheckBox.addEventListener('click', function (event) {
    depLayer.setVisible(event.target.checked);
});

/**
 * Transformation et ajout de la couche geojson des routes departementales de l'Ile de france=======================
 **/

var featureRoutes = new ol.format.GeoJSON().readFeatures(routes, {
    featureProjection: "EPSG:3857"
});
// Créer une source de données de type vecteur
var routesSource = new ol.source.Vector({
    // la liste des features
    features: featureRoutes
});
var routesLayer = new ol.layer.Vector({
    id: "routes",
    source: routesSource,
    style:new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "red",
            width: 2
        }),
        fill: new ol.style.Fill({
            color: "red"
        })
    })
});

// couche invisible au démarrage
routesLayer.setVisible(false);
// ajouter la couche à la carte
var routeCheckBox = document.getElementById('routes');
routeCheckBox.addEventListener('click', function (event) {
    routesLayer.setVisible(event.target.checked);
});


/**
 * Création et ajout de la couche chefs-lieux des départements d'Ile-de-france========================
 **/

                                /** Déclarer la classe ChefLieu **/
class ChefLieu {
    // le constructeur de la classe
    constructor (name, code, population, lat, lon) {
        // les paramétres de la classe
        this.name = name;
        this.code = code;
        this.population = population;
        this.lat = lat;
        this.lon = lon;

    }

    // les méthodes de la classe ChefLieu
    getDetails () {
        return this.name + ',</br><strong>Code dep : </strong>' + this.code + ',</br> <strong>Population : </strong>' + this.population + ' habitants.';
    }
    getPosition () {
        return {
            lon: this.lon,
            lat: this.lat
        }
    }
}

                            /** Instanciation les objets **/

var Paris = new ChefLieu('PARIS', 75, 22341, 48.86023255, 2.34467815);
var Melun = new ChefLieu('MELUN', 77, 394, 48.53980472, 2.65870164);
var Versailles = new ChefLieu('VERSAILLES', 78, 865, 48.80433562, 2.1337709);
var Evry = new ChefLieu('EVRY', 91, 524, 2.43006772, 48.62380565);
var Nanterre = new ChefLieu('NANTERRE', 92, 90, 48.89071544, 2.20430308);
var Bobigny = new ChefLieu('BOBIGNY', 93, 485, 48.90961931, 2.43876012);
var Creteil = new ChefLieu('CRETEIL', 94, 894, 48.77748912, 2.45346123);
var Pontoise = new ChefLieu('PONTOISE', 95, 298, 49.050518, 2.10135742);

// créer une liste de villes
var villes = [Paris, Melun, Versailles, Evry, Nanterre, Bobigny, Creteil, Pontoise];


                            /** Transformer la liste des chefs-lieux en une liste de features **/

// fonction pour la creation de style de différentes couleurs des points
function createStyle (color){
    return new ol.style.Style({
        image: new ol.style.Icon({
            src: "img/pin.png", // chemin d'accès du fichier de l'icon
            anchor: [0.5, 1], // pour modifier la position d'anchrage des icons
            color: color // defini la couleur de l'icon
        })
    });
}

var styleYellow = createStyle('yellow'); // le style en jaune
var styleBlue = createStyle('blue'); // le style bleu

// Formater la liste de villes pour OpenLayer
var villeFeatures = [];
for (var ville of villes){
    var lon = ville.lon;
    var lat = ville.lat;
    var coords = [lon, lat];
    var projectedCoords = ol.proj.fromLonLat(coords);
    // Objet de type ol.Feature instancié avec une géométrie, un nom...
    var feature = new ol.Feature({
        geometry: new ol.geom.Point(projectedCoords),
        name: ville.name,
        details: ville.getDetails()
    });
    // ajouter un style d'icon selon une condition
    if (ville.name === 'PARIS'){
        feature.setStyle(styleBlue); // ajout du style de icon pour Paris
    }
    else{
        feature.setStyle(styleYellow); // ajout du style de icon pour les autres chefs-lieux
    }
    villeFeatures.push(feature);
}


                                        /** Créer la Nouvelle couche vecteur **/

// La source des données de type vecteur
var villeLayerSource = new ol.source.Vector({
    // la liste des features
    features: villeFeatures,
    name: "ville-source"
});

// la couche de type vecteur (à partir de la source des données)
var villeLayer = new ol.layer.Vector({
    // la source des données de type vecteur
    source: villeLayerSource,
    id: "ville"
});

// couche invisible par défault au démarrage
villeLayer.setVisible(false);


//Ajouter l'évenement à la checkbox chefs-lieux
var villeCheckBox = document.getElementById("chefs-lieux-idf");
villeCheckBox.addEventListener("click", function (event) {
    villeLayer.setVisible(event.target.checked);
});


                                        /** créer des pop-up pour les points **/

var popup = new ol.Overlay({
    // l'élément HTML de la popup
    element: document.getElementById('map-popup'),
    positioning: 'bottom-center',
    offset: [0, -45]
});
map.addOverlay(popup);

// création de la fonction de fermeture de la pop-up (voir index.html)
function closePopup() {
    popup.setPosition(undefined);
}

// Ajouter l'événement clic à la carte
map.on("click", function (event) {
    // Fermer la popup
    closePopup();
    // Chercher la feature
    map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
        // Si la feature existe
        if (feature) {
            if (layer) {
                var layerId = layer.get("id");
                if (layerId === "ville") {
                    // récupérer les coordonnées (position)
                    var coordinates = feature.getGeometry().getCoordinates();
                    // modifier la position de la popup
                    popup.setPosition(coordinates);
                    // modifier le contenu de la popup
                    document.getElementById("map-popup-content").innerHTML =
                        "<p> <strong>Ville : </strong>" + feature.get("details") + "</p>";
                }
            }
        }
    });
});


/**
 * Créer une couche à partir d'un Service de carte tuilé ArcGIS Server ===================================
 */

// raster : service de carte ArcGIS server
var arcgisSource = new ol.source.TileArcGISRest({
    url: "https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer"
});

var arcgisLayer = new ol.layer.Tile({
    source: arcgisSource,
    // Etendu sur l'ile de france uniquement
    extent: [150000, 6120000, 400000, 6320000]
});

// couche invisible par défault au démarrage
arcgisLayer.setVisible(false);


//Ajouter l'évenement Arcgis à la checkbox
var arcgisCheckBox = document.getElementById("base-map-esri");
arcgisCheckBox.addEventListener("click", function (event) {
    arcgisLayer.setVisible(event.target.checked);
});


                                /** Ajouter les couches dans l'ordre **/
map.addLayer(arcgisLayer);
map.addLayer(depLayer);
map.addLayer(routesLayer);
map.addLayer(villeLayer);







