import { about } from "@/i18n/about";
import { date } from "@/i18n/date";
import { error } from "@/i18n/error";
import { snack } from "@/i18n/snack";
import { profile } from "@/i18n/profile";

export const i18nStrings = {
    "en": {
        "translation": {
            ...about["en"],
            ...date["en"],
            ...error["en"],
            ...snack["en"],
            ...profile["en"],
            "NotFoundSubText": "Could not find requested resource",
            "MainSubText": "Unfortunately the main page is empty for now, it is still under development.",
            "UnhandledError": "An unhandled error occurred!",
            "thisPostNotSupported": "Go to Telegram to view this post",
            "openPostInTelegramHint": "To open this post on Telegram, use the <div /> symbol in the upper right corner of the post.",
            "replyWithoutReply": "This answer is without text",
            "postSysInstruction": "You get a json post from Telegram, and your task is to analyze it, tell what you think about it, maybe see some weirdness in it. If you need to, adapt the content to the anglophone user so that he understands everything. In general, your task is to make the post short and clear, adapt it to the cultural peculiarities, if the post is in another language, maybe suggest googling something to the user to understand the topic better."
        }
    },
    "de": {
        "translation": {
            ...about["de"],
            ...date["de"],
            ...error["de"],
            ...snack["de"],
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
            "votes": "Stimmen",
            "thisPostNotSupported": "Um diesen Beitrag zu sehen, gehen Sie zu Telegram",
            "openPostInTelegramHint": "Um diesen Beitrag in Telegram zu öffnen, verwenden Sie das <div />-Symbol in der oberen rechten Ecke des Beitrags.",
            "Subscribe button": "Schaltfläche Abonnieren",
            "Play media button": "Schaltfläche Medien abspielen",
            "Load more button": "Schaltfläche Mehr laden",
            "Load more": "Mehr laden",
            "replyWithoutReply": "This reply is without text",
            "edited": "Bearb.",
            "postSysInstruction": "Du bekommst einen json-Post von Telegram, und deine Aufgabe ist es, ihn zu analysieren, ihnen zu sagen, was du davon hältst, und vielleicht ein paar Merkwürdigkeiten darin zu entdecken. Wenn nötig, passen Sie den Inhalt an einen deutschsprachigen Nutzer an, damit er alles versteht. Im Allgemeinen besteht Ihre Aufgabe darin, den Beitrag kurz und klar zu machen, ihn an die kulturellen Besonderheiten anzupassen und, wenn der Beitrag in einer anderen Sprache verfasst ist, dem Nutzer vielleicht anzubieten, etwas zu googeln, damit er das Thema besser versteht."
        }
    },
    "ru": {
        "translation": {
            ...about["ru"],
            ...date["ru"],
            ...error["ru"],
            ...snack["ru"],
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
            "votes": "голосов",
            "thisPostNotSupported": "Для просмотра этого поста перейдите в Telegram",
            "openPostInTelegramHint": "Чтобы открыть этот пост в Telegram, используйте символ <div /> в верхнем правом углу поста.",
            "Subscribe button": "Кнопка подписки",
            "Play media button": "Кнопка воспроизведения медиа",
            "Load more button": "Кнопка \"Загрузить еще\"",
            "Load more": "Загрузить еще",
            "replyWithoutReply": "Этот ответ без текста",
            "edited": "ред.",
            "postSysInstruction": "Ты получаешь на вход json-пост из Telegram, и твоя задача - проанализировать его, рассказать, что ты о нем думаешь, может быть, увидеть в нем какие-то странности. Если нужно адаптируйте контент под русскоязычного пользователя, чтобы он все понял. В общем твоя задача изложить пост коротко и ясно, адаптировать под культурные особенности, если пост на другом языке, возможно предложить погуглить что-то пользователю чтобы понять лучше тему."
        }
    },
    "uk": {
        "translation": {
            ...about["uk"],
            ...date["uk"],
            ...error["uk"],
            ...snack["uk"],
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
            "votes": "голосів",
            "thisPostNotSupported": "Для перегляду цього поста перейдіть у Telegram",
            "openPostInTelegramHint": "Щоб відкрити цей пост у Telegram, використовуйте символ <div /> у верхньому правому куті поста.",
            "Subscribe button": "Кнопка підписки",
            "Play media button": "Кнопка відтворення медіа",
            "Load more button": "Кнопка \"Завантажити більше\"",
            "Load more": "Завантажити більше",
            "replyWithoutReply": "Ця відповідь без тексту",
            "edited": "ред.",
            "postSysInstruction": "Ти отримуєш на вхід json-пост із Telegram, і твоє завдання - проаналізувати його, розповісти, що ти про нього думаєш, можливо, побачити в ньому якісь дивацтва. Якщо потрібно адаптуйте контент під україномовного користувача, щоб він усе зрозумів. Загалом твоє завдання викласти пост коротко і зрозуміло, адаптувати під культурні особливості, якщо пост іншою мовою, можливо запропонувати погуглити щось користувачеві, щоб зрозуміти краще тему."
        }
    }
}
