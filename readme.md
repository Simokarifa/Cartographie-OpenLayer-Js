# **Langages Web 3 ( JavaScript avancé )** 🌐

## **Projet final**

### Présentation

L’objectif de ce projet est de créer **une carte web de la région d’Ile-de-france** avec les couches suivantes :

- Une couche de type raster : un **fond de carte Openstreetmaps**

- Une couche de polygones : **Les départements d’Ile-de-france**
- Une couche de polylignes : **Les routes d’Ile-de-france** ( autoroutes, voies rapides et nationales )
- Une couche de points : **Les chefs lieux des départements d’Ile-de-france**

Le répertoire du projet est composé de :

- Le fichier **index.html** : le code HTML du projet
- Un dossier **/data** : contient les 2 fichiers de données
  - **departements.min.js** : le geojson des départements d’Ile-de-france **(NE PAS MODIFIER)**
  - **routes.min.js** : le geojson des routes d’Ile-de-france **(NE PAS MODIFIER)**

- Le dossier **/js** :
  - **app.js** : contient la déclaration des variables de données geojson

- Le dossier **/css** :
  - **popup.css** : le code css de la popup

Le projet est basé sur les frameworks :

- Openlayers v6.5.0
- Bootstrap v 4.6.0

Les propriétés des objets geojson :
  - **departements** :
    - code_chf
    - ***code_dept***
    - code_reg
    - geo_point_2d
    - id_geofla
    - nom_chf
    - nom_dept
    - nom_reg
    - x_centroid
    - x_chf_lieu
    - y_centroid
    - y_chf_lieu

  - **routes** :
    - cat
    - fid
    - nom
    - numero
    - objectid
    - statut

### Création de la carte

1. Créer une carte openlayers dans l'élément html *#map* avec les options suivantes:
    - Le fond de carte OpenStreetMaps
    - Une vue centrée sur l'Ile de france
    - Un contrôleur de carte: l'échelle linéaire

### Première couche : Les départements de l'Ile-de-france

1. Transformer l'objet geojson **departements** *( voir app.js )* à une couche de type vecteur avec le style suivant :
    - Bordure :
        - largeur : **1** ( pixel )
        - couleur : **#6e6e6e**
    - Remplissage :
        - opacité : **0.7**
        - couleur : utiliser **une couleur déferente pour chaque département** ( 8 couleurs ).

    > **_NOTE :_** Après la transformation de l'objet geojson **departements** à une liste de features. Chaque **feature** possèdera la propriété ***code_dept*** ( code département ). Utilisez cette propriété pour modifier la couleur du style.

2. Ajouter la couche des départements à la carte et lier sa visibilité à la checkbox ***Départements***.

### Deuxième couche : Les routes de l'Ile-de-france

1. Transformer l'objet geojson **routes** *( voir app.js )* à une couche de type vecteur avec le style suivant :
    - couleur : **#267cad**
    - opacité : **1**
    - largeur : **2** ( pixels )

2. Ajouter la couche des routes à la carte et lier sa visibilité à la checkbox ***Routes***.

### Troisième couche : Les chefs-lieux des départements d'Ile-de-france

1. Créer la classe **ChefLieu** avec les propriétés et les méthodes suivantes:

    - **Les propriétés**
        - **nom:** Le nom
        - **codeDepartement:** Le code du département
        - **population:** La population
        - **lat:** La latitude
        - **lon:** La longitude

    - **Les méthodes**
        - **getDescription:** retourne une description du chef-lieux *(  une chaîne de caractères  )*

2. Transformer le tableau suivant à une liste d'objets de type **ChefLieu**.

    | Ville         | Code département  | Population    | Longitude     | Latitude      |
    | -----------   | ----------------  | ---------     | --------      | ----------    |
    | PARIS         | 75                | 22341         | 2.34467815    | 48.86023255   |
    | MELUN         | 77                | 394           | 2.65870164    | 48.53980472   |
    | VERSAILLES    | 78                | 865           | 2.1337709     | 48.80433562   |
    | EVRY          | 91                | 524           | 2.43006772    | 48.62380565   |
    | NANTERRE      | 92                | 900           | 2.20430308    | 48.89071544   |
    | BOBIGNY       | 93                | 485           | 2.43876012    | 48.90961931   |
    | CRETEIL       | 94                | 894           | 2.45346123    | 48.77748912   |
    | PONTOISE      | 95                | 298           | 2.10135742    | 49.050518     |

3. Transformer **la liste des objets de type ChefLieu** à une **couche de type vecteur**.

4. Ajouter **la couche des chefs-lieux** à la carte et lier sa visibilité à la checkbox ***Chefs-lieux***.

### Popup avec la description du chef-lieu

1. Ajouter le code HTML de la popup au fichier *index.html*

    ```diff
        ...
        <main class="h-100 row m-0 p-0">
            <div id="map" class="h-100 col-9 m-0 p-0">
                <!-- map container -->
            </div>
            <div class="h-100 col-3 m-0 p-2">
                <!-- la liste des couches -->
                <div class="card mt-3">
                    <div class="card-header">La liste des couches :</div>
                    <div class="card-body">
                        <div class="form-check">
                            <input
                                type="checkbox"
                                class="form-check-input"
                                id="autoroute-idf"
                            />
                            <label class="form-check-label" for="routes-idf"> Routes </label>
                        </div>
                        <div class="form-check">
                            <input
                                type="checkbox"
                                class="form-check-input"
                                id="departements-idf"
                            />
                            <label class="form-check-label" for="departements-idf">
                                Départements
                            </label>
                        </div>
                    </div>
                </div>
    +           <div id="map-popup" class="ol-popup">
    +               <a
    +                   href="#"
    +                   id="popup-closer"
    +                   class="ol-popup-closer"
    +               ></a>
    +               <div id="map-popup-content"></div>
    +           </div>
            </div>
        </main>
        ...
    ```

2. Ajouter une popup avec les propriétés suivantes :
    - Affichage : lier à l'événement click sur le point du chef lieu
    - Contenu : la description retournée par la méthode **getDescription** du chef lieu
    - Fermeture : lier à l'événement click sur le bouton "X" dans la popup *( #popup-closer )*

### Facultatif: Utilisation de 2 fonds de carte

1. Ajouter le code HTML des fonds de carte

    ```diff
        ...
        <main class="h-100 row m-0 p-0">
            <div id="map" class="h-100 col-9 m-0 p-0">
                <!-- map container -->
            </div>
            <div class="h-100 col-3 m-0 p-2">
    +           <!-- les fonds de carte -->
    +           <div class="card mt-3">
    +               <div class="card-header">Les fonds de carte :</div>
    +               <div class="card-body">
    +                   <div class="form-check">
    +                       <input
    +                           class="form-check-input"
    +                           type="radio"
    +                           name="base-map"
    +                           id="base-map-osm"
    +                           value="osm"
    +                           checked
    +                       />
    +                       <label class="form-check-label" for="base-map-osm">
    +                           OpenStreetMap
    +                       </label>
    +                   </div>
    +                   <div class="form-check">
    +                       <input
    +                           class="form-check-input"
    +                           type="radio"
    +                           name="base-map"
    +                           id="base-map-esri"
    +                           value="esri"
    +                       />
    +                       <label class="form-check-label" for="base-map-esri"> Esri </label>
    +                   </div>
    +               </div>
    +           </div>
                <!-- la liste des couches -->
                <div class="card mt-3">
                    <div class="card-header">La liste des couches :</div>
                    <div class="card-body">
                        <div class="form-check">
                            <input
                                type="checkbox"
                                class="form-check-input"
                                id="autoroute-idf"
                            />
                            <label class="form-check-label" for="routes-idf"> Routes </label>
                        </div>
                        <div class="form-check">
                            <input
                                type="checkbox"
                                class="form-check-input"
                                id="departements-idf"
                            />
                            <label class="form-check-label" for="departements-idf">
                                Départements
                            </label>
                        </div>
                    </div>
                </div>
                <div id="map-popup" class="ol-popup">
                    <a
                        href="#"
                        id="popup-closer"
                        class="ol-popup-closer"
                    ></a>
                    <div id="map-popup-content"></div>
                </div>
            </div>
        </main>
        ...
    ```

2. Créer un 2ème fond de carte **Esri** à partir du Service de carte tuilé ArcGIS Server avec un étendu ( seulement l'Ile-de-france )
    > <https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer>

3. Lier les 2 fonds de carte ( OpenStreetMaps, Esri ) aux cases d'option **OpenStreetMap** ( *#base-map-osm* ) et **Esri** ( *#base-map-esri* )
