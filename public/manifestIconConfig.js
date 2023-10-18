const devIconUrl = "devManifestIcons";
const prodIconUrl = "prodManifestIcons";
const stagingIconUrl = "stagingManifestIcons";

const originalManifest = {
    "lang": "vi",
    "background_color": "#ffffff",
    "theme_color": "#1c1c1c",
    "description": "With MORE, you do more",
    "display": "fullscreen",
    "display_override": [
        "window-control-overlay",
        "minimal-ui"
    ],
    "dir": "ltr",
    "categories": [
        "estate",
        "fpland"
    ],
    "screenshots": [
        {
            "src": "/assets/images/screenshots/landing.png",
            "sizes": "402x866",
            "type": "image/png",
            "platform": "narrow",
            "label": "Mobile landing page"
        }
    ],
    "iarc_rating_id": "e58c174a-81d2-5c3c-32cc-34b8de4a52e9",
    "share_target": {
        "action": "/handle-share-content",
        "method": "POST",
        "enctype": "multipart/form-data",
        "params": {
            "title": "title",
            "text": "text",
            "url": "url",
            "files": [
                {
                    "name": "lists",
                    "accept": [
                        "image/png",
                        "image/jpg"
                    ]
                }
            ]
        }
    },
    "shortcuts": [
        {
            "name": "Login Page",
            "short_name": "login",
            "description": "Trang đăng nhập",
            "url": "/login"
        },
        {
            "name": "Signup Page",
            "short_name": "register",
            "description": "Trang đăng ký",
            "url": "/register"
        }
    ],
    "orientation": "portrait-primary",
    "name": "MORE",
    "related_applications": [
        {
            "platform": "windows",
            "url": "https://more.fpland.vn",
            "id": "more.fpland"
        }
    ],
    "prefer_related_applications": true,
    "scope": "/",
    "short_name": "MORE",
    "start_url": "/"
}
const environment = process.env.VITE_ENV || "development";

const baseIconPath = "../../assets/images/";
const iconSizes = ["48x48", "72x72", "128x128", "144x144", "152x152", "168x168", "192x192", "256x256", "512x512", "1024x1024"];
const iconType = "image/png";
const purposeMaskable = "maskable";
const purposeAny = "any";

const manifest= {
    ...originalManifest,
    "icons": generateIcons(environment),
};

function generateIcons(env) {
    const icons = [];

    iconSizes.forEach(size => {
        const icon = {
            "src": getIconPath(env, size),
            "sizes": size,
            "type": iconType,
        };

        if (size === "192x192") {
            icon.purpose = purposeMaskable;
        } else if (size === "512x512" || size === "1024x1024") {
            icon.purpose = purposeAny;
        }
        else if(size === '144x144'){
            icon.purpose = 'any'
        }

        icons.push(icon);
    });

    return icons;
}

function getIconPath(env, size) {
    switch (env) {
        case "production":
            return `${baseIconPath}${prodIconUrl}/${size}.png`;
        case "staging":
            return `${baseIconPath}${stagingIconUrl}/${size}.png`;
        default:
            return `${baseIconPath}${devIconUrl}/${size}.png`;
    }
}
export default manifest
