import { date } from "@/i18n/date";
import { error } from "@/i18n/error";
import { profile } from "@/i18n/profile";

export const i18nStrings = {
    "en": {
        "translation": {
            ...date["en"],
            ...error["en"],
            ...profile["en"],
            "NotFoundSubText": "Could not find requested resource",
            "MainSubText": "Unfortunately the main page is empty for now, it is still under development.",
            "UnhandledError": "An unhandled error occurred!",
        }
    },
    "de": {
        "translation": {
            ...date["de"],
            ...error["de"],
            ...profile["de"],
            "Go to home": "Zur Hauptseite gehen",
            "Not Found": "Nicht gefunden",
            "NotFoundSubText": "Die angeforderte Ressource konnte nicht gefunden werden",
            "Nothing": "Nichts",
            "MainSubText": "Leider ist die Hauptseite im Moment noch leer, sie befindet sich noch in der Entwicklung.",
            "Try again": "Erneut versuchen",
            "UnhandledError": "Ein unbehandelter Fehler ist aufgetreten!",
            "forwarded message": "weitergeleitete Nachricht",
            "Anonymous Poll": "Anonyme Umfrage",
        }
    },
    "ru": {
        "translation": {
            ...date["ru"],
            ...error["ru"],
            ...profile["ru"],
            "Go to home": "Перейти на домашнюю страницу",
            "Not Found": "Не найдено",
            "NotFoundSubText": "Не удалось найти запрашиваемый ресурс",
            "Nothing": "Ничего",
            "MainSubText": "К сожалению, главная страница пока пуста, она все еще находится в разработке.",
            "Try again": "Попробуйте еще раз",
            "UnhandledError": "Произошла непредвиденная ошибка!",
            "forwarded message": "пересланное сообщение",
            "Anonymous Poll": "Анонимный опрос",
        }
    },
    "uk": {
        "translation": {
            ...date["uk"],
            ...error["uk"],
            ...profile["uk"],
            "Go to home": "Перейти на головну сторінку",
            "Not Found": "Не знайдено",
            "NotFoundSubText": "Не вдалося знайти запитуваний ресурс",
            "Nothing": "Нічого",
            "MainSubText": "На жаль, головна сторінка поки що порожня, вона все ще перебуває на стадії розробки.",
            "Try again": "Спробуйте ще раз",
            "UnhandledError": "Виникла непередбачувана помилка!",
            "forwarded message": "переслане повідомлення",
            "Anonymous Poll": "Анонімне опитування",
        }
    }
}
