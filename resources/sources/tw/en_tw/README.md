<img src="https://cdn.door43.org/assets/uw-icons/logo-utw-256.png" alt="drawing" width="100"/>

# unfoldingWord® Translation Words

This is the repository for the [unfoldingWord® Translation Words (UTW)](https://www.unfoldingword.org/utw) resource.

## Description

UTW is a basic Bible dictionary that is based on the English vocabulary of the ULT. We intend that it will be translated into other Gateway Languages, each of which will be based on the vocabulary of the GLT in that language. Its purpose is to provide translators with concise definitions of important or difficult biblical concepts, along with translation suggestions for those concepts, to help them make sound translation decisions.

While based on English vocabulary, UTW will seek to organize its definitions by concept, in order to allow GL translators to more easily sort and combine the concepts into the categories and vocabulary of their own Gateway Languages. This means that an English word with multiple sentences will yield one UTW article for each sense. GL translators can then take these articles and arrange them under the appropriate head word or words of their own language.

## Categories

In order to not burden the translator unneccessarily with definitions of routine vocabulary, UTW articles will be limited to the following categories of key or difficult concepts. Concepts that qualify for a UTW article are:

1. Theologically freighted. They carry a lot of theological weight and meaning, so it is important to get them right and be consistent in using them. So even if they aren’t difficult (although they usually are), they are important. Examples: righteousness, forgiveness, sin, grace, love.
2. Unusual or obscure. Examples: abomination, eunuch, iniquity, propitiation, chariot.
3. Have a modern usage but a different ancient/biblical usage. Examples: altar, priest, bless, curse, clean, unclean, church.
4. Unique to the Bible. Examples: Ark, gentile, psalm, tabernacle.
5. Transliterated. Examples: shekel, ephah, amen, apostle, angel.
6. Ambiguous. That is, concepts are lumped together into one English or GL word so that it is unclear which concept is being accessed in any certain context of the ULT or GLT. This is the category that the GL team will need to do the most work in to adjust to the GL. Examples: call, fear, age, great.

## UTW differentiated from UTN, UGL, and UHAL

It is important to note that UTW is only one component in a set of translation tools and resources. It is not intended to cover everything, but only the concepts as described above. It is also important to note that UTW is not based on Hebrew, Aramaic, or Greek and does not provide definitions of terms from those languages. The unfoldingWord® Hebrew and Aramaic Lexicon (UHAL) and the unfoldingWord® Greek Lexicon (UGL) will do that.

The two “front-line” checking tools based on UTW and UTN are also complementary and are most useful for the translator when they remain distinct. For that reason, both resources are limited to their own domains. UTW is limited to the categories of key and difficult concepts, and UTN is limited to the categories of difficulties specified for it (figures of speech, grammar, etc.).

The value of UTW for translators is to provide definitions for general concepts that they will find difficult to translate. A primary differentiator between UTW and UTN is that UTN addresses individual, verse-specific difficulties. It speaks to the exact problem in the exact context, many of which may only occur once in the Bible. For example, a UTN metaphor check is backstopped by the general UTA article on metaphor, but the specific note explains the specific metaphor that may be unique to that verse and occur nowhere else. The tool based on UTW, on the other hand, addresses concepts that recur constantly throughout the Bible, so the help that it gives is much more general, and one article may apply dozens of times, even in the same book. The strength of checking with this tool is that it allows translators to see each instance of a recurring concept in its context, but gathered into one place where the translation of each one can be compared side-by-side for appropriateness and consistency.

## Downloading

If you want to download UTW to use, go here: [https://www.unfoldingword.org/utw](https://www.unfoldingword.org/utw). UTW is also included in [tS](https://ufw.io/ts) and [tC](https://ufw.io/tc).

## Improving the tWs

Please use the [issue queue](https://git.door43.org/unfoldingWord/en_tw/issues) to provide feedback or suggestions for improvement.

If you want to make your suggested changes then you may use the online editor to do so. See the [protected branch workflow](https://forum.ccbt.bible/t/protected-branch-workflow/76) document for step by step instructions.

## Structure

The tWs are organized into three sub directories under `bible`.

* The subdirectory `kt` contains “key terms” which we consider to be of special importance in the Bible.
* The subdirectory `other` contains terms which require explanation but are of less importance than the “key terms.”
* The subdirectory `names` contains proper names of people and places in the Bible.

## GL Translators

### tW Translation Philosophy

To learn the philosophy of how to translate the tWs please see the [Translate the translationWords](https://gl-manual.readthedocs.io/en/latest/gl_translation.html#translating-translationwords) article in the [Gateway Language Manual](https://gl-manual.readthedocs.io/).

If you are translating online, please fork the [Door43-Catalog/en_tw](https://git.door43.org/Door43-Catalog/en_tw) repository, following this workflow: [Translate Content Online](https://forum.ccbt.bible/t/translate-content-online/75).

## License

See the [LICENSE](https://git.door43.org/unfoldingWord/en_tw/src/branch/master/LICENSE.md) file for licensing information.
