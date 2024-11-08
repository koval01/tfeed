import { countries } from "./countries";
import { menu } from "./menu";
import { personalities } from "./personalities";
import { interests } from "./interests";

export const i18nStrings = {
    "en": {
        "translation": {
            ...personalities["en"].translation,
            "Settings description": "You can always delete all the data you give us by submitting a profile deletion request or through technical support.",
            "Display name subhead": "This is the name that all users will see, we recommend using your own name or an alias for example.",
            "Bio subhead": "Tell about yourself, don't be shy",
            "Bio placeholder": "I am a 20-year-old full-stack developer from Germany. I love anime and computer games, and I'm a fan of the bratishkinoff streamer.",
            "Interests subhead": "Enter a list of your interests, they will be used to find people similar to your interests.",
            "Personality subhead": "Specify your personality type, it is also taken into account by the recommendation algorithm.",
            "Delete account subhead": "By deleting your account, you will destroy all records about you in our database. This action is irreversible.",
            "Location subhead": "The location you enter is taken into account when searching for people near you."
        }
    },
    "ru": {
        "translation": {
            ...personalities["ru"].translation,
            ...interests["ru"].translation,
            ...countries["ru"].translation,
            ...menu["ru"].translation,
            "Edit": "Редактировать",
            "Visible": "Видимый",
            "This user is verified": "Этот пользователь подтвержден",
            "Hidden": "Невидимка",
            "Personality": "Личность",
            "Interests": "Интересы",
            "Location": "Местоположение",
            "Users's image": "Фотография пользователя",
            "Users's gallery": "Галерея пользователя",
            "Recently joined": "Недавно присоединились",
            "People are nearby": "Люди рядом",
            "probably": "вероятно",
            "nothing": "ничего",
            "here": "здесь",
            "now": "сейчас",
            "Display name": "Отображаемое имя",
            "Bio": "Биография",
            "Country": "Страна",
            "Enter country name": "Введите название страны",
            "City": "Город",
            "Enter city name": "Введите название города",
            "Unknown": "Неизвестно",
            "Nothing selected": "Ничего не выбрано",
            "Add interest": "Добавить интерес",
            "Settings description": "Все данные которые вы нам передаете вы всегда можете удалить отправив запрос на удаление профиля или через техническую поддержку.",
            "Display name subhead": "Это имя которое будут видеть все пользователи, рекомендуем использовать собственное имя или к примеру псевдоним.",
            "Bio subhead": "Расскажите о себе, не стесняйтесь",
            "Bio placeholder": "Я 20-летний full-stack разработчик из Германии. Я люблю аниме и компьютерные игры, а также являюсь поклонником стримера bratishkinoff.",
            "Interests subhead": "Укажите список ваших интересов, они будут использоваться для поиска похожих по вашим интересам людей.",
            "Personality subhead": "Укажите свой тип личности, он также учитывается алгоритмом рекомендаций.",
            "Delete account subhead": "Удалив свой аккаунт вы уничтожите все записи о себе в нашей базе данных. Это действие необратимо.",
            "Location subhead": "Указанное вами местоположение учитывается при поиске людей рядом с вами."
        }
    },
    "uk": {
        "translation": {
            ...personalities["uk"].translation,
            ...interests["uk"].translation,
            ...countries["uk"].translation,
            ...menu["uk"].translation,
            "Edit": "Редагувати",
            "Visible": "Видимий",
            "This user is verified": "Цей користувач підтверджений",
            "Hidden": "Невидимка",
            "Personality": "Особистість",
            "Interests": "Інтереси",
            "Location": "Розташування",
            "Users's image": "Фотографія користувача",
            "Users's gallery": "Галерея користувача",
            "Recently joined": "Нещодавно приєдналися",
            "People are nearby": "Люди поруч",
            "probably": "ймовірно",
            "nothing": "нічого",
            "here": "тут",
            "now": "зараз",
            "Display name": "Відображуване ім'я",
            "Bio": "Біографія",
            "Country": "Країна",
            "Enter country name": "Введіть назву країни",
            "City": "Місто",
            "Enter city name": "Введіть назву міста",
            "Unknown": "Невідомо",
            "Nothing selected": "Нічого не обрано",
            "Add interest": "Додати інтерес",
            "Settings description": "Всі дані які ви нам передаєте ви завжди можете видалити відправивши запит на видалення профілю або через технічну підтримку.",
            "Display name subhead": "Це ім'я, яке бачитимуть усі користувачі, рекомендуємо використовувати власне ім'я або, наприклад, псевдонім.",
            "Bio subhead": "Розкажіть про себе, не соромтеся",
            "Bio placeholder": "Я 20-річний full-stack розробник з Німеччини. Я люблю аніме та комп'ютерні ігри, а також є фанатом стрімера bratishkinoff.",
            "Interests subhead": "Вкажіть список ваших інтересів, вони будуть використовуватися для пошуку схожих за вашими інтересами людей.",
            "Personality subhead": "Вкажіть свій тип особистості, він також враховується алгоритмом рекомендацій.",
            "Delete account subhead": "Видаливши свій обліковий запис ви знищите всі записи про себе в нашій базі даних. Це дія безповоротна.",
            "Location subhead": "Зазначене вами розташування враховується при пошуку людей поряд з вами."
        }
    }
}
