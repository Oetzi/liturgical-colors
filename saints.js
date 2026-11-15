/*
 * Fixed-date celebrations: General Roman Calendar with the proper calendar for the dioceses of the United States.
 * Dates, ranks and Spanish titles were checked against the USCCB "Liturgical Calendar for the Dioceses of the
 * United States of America 2027" (including its Spanish appendix).
 * One per line:  month/day | rank | colour | name | description | id | nombre | descripción
 * rank:   S solemnity, L feast of the Lord, F feast, M memorial, O optional memorial, D All Souls, P day of prayer
 * colour: w white, r red, v violet
 * id:     only for days with special rules (see calendar.js)
 */
(typeof window !== 'undefined' ? window : globalThis).LITCAL_SAINTS = `
1/1|S|w|Mary, the Holy Mother of God|Octave day of Christmas|obl|Santa María, Madre de Dios|Octava de la Natividad del Señor
1/2|M|w|Sts. Basil the Great and Gregory Nazianzen|Bishops and Doctors of the Church||Santos Basilio Magno y Gregorio Nacianceno|Obispos y doctores de la Iglesia
1/3|O|w|The Most Holy Name of Jesus|||Santísimo Nombre de Jesús|
1/4|M|w|St. Elizabeth Ann Seton|Religious; first US-born saint, founder of the Sisters of Charity||Santa Isabel Ana Seton|Religiosa
1/5|M|w|St. John Neumann|Bishop of Philadelphia||San Juan Nepomuceno Neumann|Obispo
1/6|O|w|St. André Bessette|Religious; the doorkeeper of Montreal||San Andrés Bessette|Religioso
1/7|O|w|St. Raymond of Penyafort|Priest; patron of canon lawyers||San Raimundo de Peñafort|Presbítero
1/13|O|w|St. Hilary|Bishop and Doctor of the Church||San Hilario|Obispo y doctor de la Iglesia
1/17|M|w|St. Anthony|Abbot; father of monastic life||San Antonio|Abad
1/20|O|r|St. Fabian|Pope and martyr||San Fabián|Papa y mártir
1/20|O|r|St. Sebastian|Martyr; patron of athletes and soldiers||San Sebastián|Mártir
1/21|M|r|St. Agnes|Virgin and martyr||Santa Inés|Virgen y mártir
1/22|P|w|Day of Prayer for the Legal Protection of Unborn Children|United States|unborn|Día de oración por la protección legal de la criatura en el vientre materno|Estados Unidos
1/23|O|r|St. Vincent|Deacon and martyr||San Vicente|Diácono y mártir
1/23|O|w|St. Marianne Cope|Virgin; served the leprosy patients of Molokai||Santa Mariana Cope|Virgen
1/24|M|w|St. Francis de Sales|Bishop and Doctor of the Church; patron of writers||San Francisco de Sales|Obispo y doctor de la Iglesia
1/25|F|w|The Conversion of St. Paul the Apostle|||Conversión de san Pablo, apóstol|
1/26|M|w|Sts. Timothy and Titus|Bishops; companions of St. Paul||Santos Timoteo y Tito|Obispos
1/27|O|w|St. Angela Merici|Virgin; founder of the Ursulines||Santa Ángela Merici|Virgen
1/28|M|w|St. Thomas Aquinas|Priest and Doctor of the Church; patron of students||Santo Tomás de Aquino|Presbítero y doctor de la Iglesia
1/31|M|w|St. John Bosco|Priest; patron of young people||San Juan Bosco|Presbítero
2/2|L|w|The Presentation of the Lord|Candlemas||Presentación del Señor|La Candelaria
2/3|O|r|St. Blaise|Bishop and martyr; invoked for ailments of the throat||San Blas|Obispo y mártir
2/3|O|w|St. Ansgar|Bishop; apostle of Scandinavia||San Óscar|Obispo
2/5|M|r|St. Agatha|Virgin and martyr||Santa Águeda|Virgen y mártir
2/6|M|r|St. Paul Miki and Companions|Martyrs of Nagasaki||Santos Pablo Miki y compañeros|Mártires
2/8|O|w|St. Jerome Emiliani|Patron of orphans||San Jerónimo Emiliani|
2/8|O|w|St. Josephine Bakhita|Virgin; freed from slavery in Sudan||Santa Josefina Bakhita|Virgen
2/10|M|w|St. Scholastica|Virgin; sister of St. Benedict||Santa Escolástica|Virgen
2/11|O|w|Our Lady of Lourdes|World Day of the Sick||Bienaventurada Virgen María de Lourdes|Jornada Mundial del Enfermo
2/14|M|w|Sts. Cyril and Methodius|Monk and bishop; apostles to the Slavs||Santos Cirilo y Metodio|Monje y obispo
2/17|O|w|The Seven Holy Founders of the Servite Order|||Los siete santos Fundadores de la Orden de los Siervos de la Bienaventurada Virgen María|
2/21|O|w|St. Peter Damian|Bishop and Doctor of the Church||San Pedro Damián|Obispo y doctor de la Iglesia
2/22|F|w|The Chair of St. Peter the Apostle|||Cátedra de san Pedro, apóstol|
2/23|M|r|St. Polycarp|Bishop and martyr||San Policarpo|Obispo y mártir
2/27|O|w|St. Gregory of Narek|Abbot and Doctor of the Church||San Gregorio de Narek|Abad y doctor de la Iglesia
3/3|O|w|St. Katharine Drexel|Virgin; founder of the Sisters of the Blessed Sacrament||Santa Catalina Drexel|Virgen
3/4|O|w|St. Casimir|Prince of Poland||San Casimiro|
3/7|M|r|Sts. Perpetua and Felicity|Martyrs of Carthage||Santas Perpetua y Felicidad|Mártires
3/8|O|w|St. John of God|Religious; patron of hospitals and the sick||San Juan de Dios|Religioso
3/9|O|w|St. Frances of Rome|Religious||Santa Francisca Romana|Religiosa
3/17|O|w|St. Patrick|Bishop; apostle of Ireland||San Patricio|Obispo
3/18|O|w|St. Cyril of Jerusalem|Bishop and Doctor of the Church||San Cirilo de Jerusalén|Obispo y doctor de la Iglesia
3/19|S|w|St. Joseph, Spouse of the Blessed Virgin Mary|Patron of the universal Church|joseph|San José, esposo de la Bienaventurada Virgen María|Patrono de la Iglesia universal
3/23|O|w|St. Turibius of Mogrovejo|Bishop of Lima||Santo Toribio de Mogrovejo|Obispo
3/25|S|w|The Annunciation of the Lord||annunciation|Anunciación del Señor|
4/2|O|w|St. Francis of Paola|Hermit||San Francisco de Paula|Ermitaño
4/4|O|w|St. Isidore|Bishop and Doctor of the Church||San Isidoro|Obispo y doctor de la Iglesia
4/5|O|w|St. Vincent Ferrer|Priest||San Vicente Ferrer|Presbítero
4/7|M|w|St. John Baptist de la Salle|Priest; patron of teachers||San Juan Bautista de la Salle|Presbítero
4/11|M|r|St. Stanislaus|Bishop and martyr||San Estanislao|Obispo y mártir
4/13|O|r|St. Martin I|Pope and martyr||San Martín I|Papa y mártir
4/21|O|w|St. Anselm|Bishop and Doctor of the Church||San Anselmo|Obispo y doctor de la Iglesia
4/23|O|r|St. George|Martyr||San Jorge|Mártir
4/23|O|r|St. Adalbert|Bishop and martyr||San Adalberto|Obispo y mártir
4/24|O|r|St. Fidelis of Sigmaringen|Priest and martyr||San Fidel de Sigmaringa|Presbítero y mártir
4/25|F|r|St. Mark|Evangelist||San Marcos|Evangelista
4/28|O|r|St. Peter Chanel|Priest and martyr; apostle of Oceania||San Pedro Chanel|Presbítero y mártir
4/28|O|w|St. Louis Grignion de Montfort|Priest||San Luis María Grignion de Montfort|Presbítero
4/29|M|w|St. Catherine of Siena|Virgin and Doctor of the Church||Santa Catalina de Siena|Virgen y doctora de la Iglesia
4/30|O|w|St. Pius V|Pope||San Pío V|Papa
5/1|O|w|St. Joseph the Worker|||San José Obrero|
5/2|M|w|St. Athanasius|Bishop and Doctor of the Church||San Atanasio|Obispo y doctor de la Iglesia
5/3|F|r|Sts. Philip and James|Apostles||Santos Felipe y Santiago|Apóstoles
5/10|O|w|St. Damien de Veuster|Priest; served the leprosy patients of Molokai||San Damián de Veuster|Presbítero
5/10|O|w|St. John of Ávila|Priest and Doctor of the Church||San Juan de Ávila|Presbítero y doctor de la Iglesia
5/12|O|r|Sts. Nereus and Achilleus|Martyrs||Santos Nereo y Aquileo|Mártires
5/12|O|r|St. Pancras|Martyr||San Pancracio|Mártir
5/13|O|w|Our Lady of Fatima|||Bienaventurada Virgen María de Fátima|
5/14|F|r|St. Matthias|Apostle||San Matías|Apóstol
5/15|O|w|St. Isidore|Farmer; patron of farmers||San Isidro Labrador|
5/18|O|r|St. John I|Pope and martyr||San Juan I|Papa y mártir
5/20|O|w|St. Bernardine of Siena|Priest||San Bernardino de Siena|Presbítero
5/21|O|r|St. Christopher Magallanes and Companions|Martyrs of Mexico||Santos Cristóbal Magallanes y compañeros|Presbítero y mártires
5/22|O|w|St. Rita of Cascia|Religious||Santa Rita de Casia|Religiosa
5/25|O|w|St. Bede the Venerable|Priest and Doctor of the Church||San Beda el Venerable|Presbítero y doctor de la Iglesia
5/25|O|w|St. Gregory VII|Pope||San Gregorio VII|Papa
5/25|O|w|St. Mary Magdalene de’ Pazzi|Virgin||Santa María Magdalena de Pazzi|Virgen
5/26|M|w|St. Philip Neri|Priest; founder of the Oratory||San Felipe Neri|Presbítero
5/27|O|w|St. Augustine of Canterbury|Bishop; apostle of England||San Agustín de Canterbury|Obispo
5/29|O|w|St. Paul VI|Pope||San Pablo VI|Papa
5/31|F|w|The Visitation of the Blessed Virgin Mary|||Visitación de la Bienaventurada Virgen María|
6/1|M|r|St. Justin|Martyr||San Justino|Mártir
6/2|O|r|Sts. Marcellinus and Peter|Martyrs||Santos Marcelino y Pedro|Mártires
6/3|M|r|St. Charles Lwanga and Companions|Martyrs of Uganda||Santos Carlos Lwanga y compañeros|Mártires
6/5|M|r|St. Boniface|Bishop and martyr; apostle of Germany||San Bonifacio|Obispo y mártir
6/6|O|w|St. Norbert|Bishop||San Norberto|Obispo
6/9|O|w|St. Ephrem|Deacon and Doctor of the Church||San Efrén|Diácono y doctor de la Iglesia
6/11|M|r|St. Barnabas|Apostle||San Bernabé|Apóstol
6/13|M|w|St. Anthony of Padua|Priest and Doctor of the Church; invoked for lost things||San Antonio de Padua|Presbítero y doctor de la Iglesia
6/19|O|w|St. Romuald|Abbot||San Romualdo|Abad
6/21|M|w|St. Aloysius Gonzaga|Religious; patron of youth||San Luis Gonzaga|Religioso
6/22|O|w|St. Paulinus of Nola|Bishop||San Paulino de Nola|Obispo
6/22|O|r|Sts. John Fisher and Thomas More|Bishop and martyr; martyr||Santos Juan Fisher y Tomás Moro|Obispo y mártires
6/24|S|w|The Nativity of St. John the Baptist||baptist|Natividad de san Juan Bautista|
6/27|O|w|St. Cyril of Alexandria|Bishop and Doctor of the Church||San Cirilo de Alejandría|Obispo y doctor de la Iglesia
6/28|M|r|St. Irenaeus|Bishop, martyr and Doctor of the Church||San Ireneo|Obispo, mártir y doctor de la Iglesia
6/29|S|r|Sts. Peter and Paul|Apostles||Santos Pedro y Pablo|Apóstoles
6/30|O|r|The First Martyrs of the Holy Roman Church|||Primeros santos mártires de la Iglesia Romana|
7/1|O|w|St. Junípero Serra|Priest; missionary in California||San Junípero Serra|Presbítero
7/3|F|r|St. Thomas|Apostle||Santo Tomás|Apóstol
7/4|O|w|Independence Day|United States||Día de la Independencia de los Estados Unidos|
7/5|O|w|St. Anthony Zaccaria|Priest||San Antonio María Zacaría|Presbítero
7/5|O|w|St. Elizabeth of Portugal|Queen and peacemaker||Santa Isabel de Portugal|
7/6|O|r|St. Maria Goretti|Virgin and martyr||Santa María Goretti|Virgen y mártir
7/9|O|r|St. Augustine Zhao Rong and Companions|Martyrs of China||Santos Agustín Zhao Rong y compañeros|Presbítero y mártires
7/11|M|w|St. Benedict|Abbot; father of Western monasticism||San Benito|Abad
7/13|O|w|St. Henry|Emperor||San Enrique|
7/14|M|w|St. Kateri Tekakwitha|Virgin; first Native American saint||Santa Kateri Tekakwitha|Virgen
7/15|M|w|St. Bonaventure|Bishop and Doctor of the Church||San Buenaventura|Obispo y doctor de la Iglesia
7/16|O|w|Our Lady of Mount Carmel|||Bienaventurada Virgen María del Carmen|
7/18|O|w|St. Camillus de Lellis|Priest; patron of nurses and the sick||San Camilo de Lelis|Presbítero
7/20|O|r|St. Apollinaris|Bishop and martyr||San Apolinar|Obispo y mártir
7/21|O|w|St. Lawrence of Brindisi|Priest and Doctor of the Church||San Lorenzo de Brindis|Presbítero y doctor de la Iglesia
7/22|F|w|St. Mary Magdalene|Apostle to the Apostles||Santa María Magdalena|
7/23|O|w|St. Bridget|Religious||Santa Brígida|Religiosa
7/24|O|w|St. Sharbel Makhlūf|Priest and hermit||San Chárbel Makhlūf|Presbítero
7/25|F|r|St. James|Apostle||Santiago|Apóstol
7/26|M|w|Sts. Joachim and Anne|Parents of the Blessed Virgin Mary||Santos Joaquín y Ana|Padres de la Bienaventurada Virgen María
7/29|M|w|Sts. Martha, Mary and Lazarus|Friends of the Lord at Bethany||Santos Marta, María y Lázaro|
7/30|O|w|St. Peter Chrysologus|Bishop and Doctor of the Church||San Pedro Crisólogo|Obispo y doctor de la Iglesia
7/31|M|w|St. Ignatius of Loyola|Priest; founder of the Jesuits||San Ignacio de Loyola|Presbítero
8/1|M|w|St. Alphonsus Liguori|Bishop and Doctor of the Church||San Alfonso María de Ligorio|Obispo y doctor de la Iglesia
8/2|O|w|St. Eusebius of Vercelli|Bishop||San Eusebio de Vercelli|Obispo
8/2|O|w|St. Peter Julian Eymard|Priest||San Pedro Julián Eymard|Presbítero
8/4|M|w|St. John Vianney|Priest; patron of parish priests||San Juan María Vianney|Presbítero
8/5|O|w|The Dedication of the Basilica of St. Mary Major|||Dedicación de la Basílica de Santa María la Mayor|
8/6|L|w|The Transfiguration of the Lord|||Transfiguración del Señor|
8/7|O|r|St. Sixtus II and Companions|Pope and martyrs||Santos Sixto II y compañeros|Papa y mártires
8/7|O|w|St. Cajetan|Priest||San Cayetano|Presbítero
8/8|M|w|St. Dominic|Priest; founder of the Order of Preachers||Santo Domingo de Guzmán|Presbítero
8/9|O|r|St. Teresa Benedicta of the Cross|Virgin and martyr (Edith Stein)||Santa Teresa Benedicta de la Cruz|Virgen y mártir
8/10|F|r|St. Lawrence|Deacon and martyr||San Lorenzo|Diácono y mártir
8/11|M|w|St. Clare|Virgin; founder of the Poor Clares||Santa Clara|Virgen
8/12|O|w|St. Jane Frances de Chantal|Religious||Santa Juana Francisca de Chantal|Religiosa
8/13|O|r|Sts. Pontian and Hippolytus|Pope and priest, martyrs||Santos Ponciano e Hipólito|Papa y presbítero, mártires
8/14|M|r|St. Maximilian Kolbe|Priest and martyr||San Maximiliano María Kolbe|Presbítero y mártir
8/15|S|w|The Assumption of the Blessed Virgin Mary||obl|Asunción de la Bienaventurada Virgen María|
8/16|O|w|St. Stephen of Hungary|King||San Esteban de Hungría|
8/19|O|w|St. John Eudes|Priest||San Juan Eudes|Presbítero
8/20|M|w|St. Bernard|Abbot and Doctor of the Church||San Bernardo|Abad y doctor de la Iglesia
8/21|M|w|St. Pius X|Pope||San Pío X|Papa
8/22|M|w|The Queenship of the Blessed Virgin Mary|||Bienaventurada Virgen María Reina|
8/23|O|w|St. Rose of Lima|Virgin; first saint of the Americas||Santa Rosa de Lima|Virgen
8/24|F|r|St. Bartholomew|Apostle||San Bartolomé|Apóstol
8/25|O|w|St. Louis|King of France||San Luis|Rey de Francia
8/25|O|w|St. Joseph Calasanz|Priest||San José de Calasanz|Presbítero
8/27|M|w|St. Monica|Mother of St. Augustine||Santa Mónica|
8/28|M|w|St. Augustine|Bishop and Doctor of the Church||San Agustín|Obispo y doctor de la Iglesia
8/29|M|r|The Passion of St. John the Baptist|||Martirio de san Juan Bautista|
9/3|M|w|St. Gregory the Great|Pope and Doctor of the Church||San Gregorio Magno|Papa y doctor de la Iglesia
9/5|O|w|St. Teresa of Calcutta|Virgin; founder of the Missionaries of Charity||Santa Teresa de Calcuta|Virgen
9/8|F|w|The Nativity of the Blessed Virgin Mary|||Natividad de la Bienaventurada Virgen María|
9/9|M|w|St. Peter Claver|Priest; served enslaved Africans in Cartagena||San Pedro Claver|Presbítero
9/12|O|w|The Most Holy Name of Mary|||Santísimo Nombre de María|
9/13|M|w|St. John Chrysostom|Bishop and Doctor of the Church||San Juan Crisóstomo|Obispo y doctor de la Iglesia
9/14|L|r|The Exaltation of the Holy Cross|||Exaltación de la Santa Cruz|
9/15|M|w|Our Lady of Sorrows|||Bienaventurada Virgen María de los Dolores|
9/16|M|r|Sts. Cornelius and Cyprian|Pope and bishop, martyrs||Santos Cornelio y Cipriano|Papa y obispo, mártires
9/17|O|w|St. Robert Bellarmine|Bishop and Doctor of the Church||San Roberto Belarmino|Obispo y doctor de la Iglesia
9/17|O|w|St. Hildegard of Bingen|Virgin and Doctor of the Church||Santa Hildegarda de Bingen|Virgen y doctora de la Iglesia
9/19|O|r|St. Januarius|Bishop and martyr||San Jenaro|Obispo y mártir
9/20|M|r|Sts. Andrew Kim Tae-gŏn, Paul Chŏng Ha-sang and Companions|Martyrs of Korea||Santos Andrés Kim Tae-gŏn, Pablo Chŏng Ha-sang y compañeros|Mártires
9/21|F|r|St. Matthew|Apostle and Evangelist||San Mateo|Apóstol y evangelista
9/23|M|w|St. Pius of Pietrelcina|Priest (Padre Pio)||San Pío de Pietrelcina|Presbítero
9/26|O|r|Sts. Cosmas and Damian|Martyrs; patrons of physicians||Santos Cosme y Damián|Mártires
9/27|M|w|St. Vincent de Paul|Priest; patron of charitable works||San Vicente de Paúl|Presbítero
9/28|O|r|St. Wenceslaus|Martyr||San Wenceslao|Mártir
9/28|O|r|St. Lawrence Ruiz and Companions|Martyrs||Santos Lorenzo Ruiz y compañeros|Mártires
9/29|F|w|Sts. Michael, Gabriel and Raphael|Archangels||Santos arcángeles Miguel, Gabriel y Rafael|
9/30|M|w|St. Jerome|Priest and Doctor of the Church; translator of the Bible||San Jerónimo|Presbítero y doctor de la Iglesia
10/1|M|w|St. Thérèse of the Child Jesus|Virgin and Doctor of the Church||Santa Teresa del Niño Jesús|Virgen y doctora de la Iglesia
10/2|M|w|The Holy Guardian Angels|||Santos Ángeles Custodios|
10/4|M|w|St. Francis of Assisi|Founder of the Franciscans||San Francisco de Asís|
10/5|O|w|St. Faustina Kowalska|Virgin; apostle of Divine Mercy||Santa Faustina Kowalska|Virgen
10/5|O|w|Bl. Francis Xavier Seelos|Priest||Beato Francisco Javier Seelos|Presbítero
10/6|O|w|St. Bruno|Priest; founder of the Carthusians||San Bruno|Presbítero
10/6|O|w|Bl. Marie Rose Durocher|Virgin||Beata María Rosa Durocher|Virgen
10/7|M|w|Our Lady of the Rosary|||Bienaventurada Virgen María del Rosario|
10/9|O|r|St. Denis and Companions|Bishop and martyrs||Santos Dionisio y compañeros|Obispo y mártires
10/9|O|w|St. John Leonardi|Priest||San Juan Leonardi|Presbítero
10/9|O|w|St. John Henry Newman|Priest and Doctor of the Church||San Juan Enrique Newman|Presbítero y doctor de la Iglesia
10/11|O|w|St. John XXIII|Pope||San Juan XXIII|Papa
10/14|O|r|St. Callistus I|Pope and martyr||San Calixto I|Papa y mártir
10/15|M|w|St. Teresa of Jesus|Virgin and Doctor of the Church (Teresa of Ávila)||Santa Teresa de Jesús|Virgen y doctora de la Iglesia
10/16|O|w|St. Hedwig|Religious||Santa Eduviges|Religiosa
10/16|O|w|St. Margaret Mary Alacoque|Virgin; apostle of the Sacred Heart||Santa Margarita María Alacoque|Virgen
10/17|M|r|St. Ignatius of Antioch|Bishop and martyr||San Ignacio de Antioquía|Obispo y mártir
10/18|F|r|St. Luke|Evangelist||San Lucas|Evangelista
10/19|M|r|Sts. John de Brébeuf, Isaac Jogues and Companions|North American martyrs||Santos Juan de Brébeuf, Isaac Jogues y compañeros|Presbíteros y mártires
10/20|O|w|St. Paul of the Cross|Priest; founder of the Passionists||San Pablo de la Cruz|Presbítero
10/22|O|w|St. John Paul II|Pope||San Juan Pablo II|Papa
10/23|O|w|St. John of Capistrano|Priest||San Juan de Capistrano|Presbítero
10/24|O|w|St. Anthony Mary Claret|Bishop||San Antonio María Claret|Obispo
10/28|F|r|Sts. Simon and Jude|Apostles||Santos Simón y Judas|Apóstoles
11/1|S|w|All Saints||obl|Todos los Santos|
11/2|D|v|The Commemoration of All the Faithful Departed (All Souls’ Day)||souls|Conmemoración de todos los fieles difuntos|
11/3|O|w|St. Martin de Porres|Religious||San Martín de Porres|Religioso
11/4|M|w|St. Charles Borromeo|Bishop||San Carlos Borromeo|Obispo
11/9|L|w|The Dedication of the Lateran Basilica|Cathedral of the Bishop of Rome||Dedicación de la Basílica de Letrán|Catedral del Obispo de Roma
11/10|M|w|St. Leo the Great|Pope and Doctor of the Church||San León Magno|Papa y doctor de la Iglesia
11/11|M|w|St. Martin of Tours|Bishop||San Martín de Tours|Obispo
11/12|M|r|St. Josaphat|Bishop and martyr||San Josafat|Obispo y mártir
11/13|M|w|St. Frances Xavier Cabrini|Virgin; patron of immigrants||Santa Francisca Javier Cabrini|Virgen
11/15|O|w|St. Albert the Great|Bishop and Doctor of the Church||San Alberto Magno|Obispo y doctor de la Iglesia
11/16|O|w|St. Margaret of Scotland|Queen||Santa Margarita de Escocia|
11/16|O|w|St. Gertrude|Virgin||Santa Gertrudis|Virgen
11/17|M|w|St. Elizabeth of Hungary|Religious||Santa Isabel de Hungría|Religiosa
11/18|O|w|The Dedication of the Basilicas of Sts. Peter and Paul|||Dedicación de las Basílicas de San Pedro y San Pablo, apóstoles|
11/18|O|w|St. Rose Philippine Duchesne|Virgin; missionary on the American frontier||Santa Rosa Filipina Duchesne|Virgen
11/21|M|w|The Presentation of the Blessed Virgin Mary|||Presentación de la Bienaventurada Virgen María|
11/22|M|r|St. Cecilia|Virgin and martyr; patron of musicians||Santa Cecilia|Virgen y mártir
11/23|O|r|St. Clement I|Pope and martyr||San Clemente I|Papa y mártir
11/23|O|w|St. Columban|Abbot||San Columbano|Abad
11/23|O|r|Bl. Miguel Agustín Pro|Priest and martyr||Beato Miguel Agustín Pro|Presbítero y mártir
11/24|M|r|St. Andrew Dũng-Lạc and Companions|Martyrs of Vietnam||Santos Andrés Dũng-Lạc y compañeros|Presbítero y mártires
11/25|O|r|St. Catherine of Alexandria|Virgin and martyr||Santa Catalina de Alejandría|Virgen y mártir
11/30|F|r|St. Andrew|Apostle||San Andrés|Apóstol
12/3|M|w|St. Francis Xavier|Priest; patron of missions||San Francisco Javier|Presbítero
12/4|O|w|St. John Damascene|Priest and Doctor of the Church||San Juan Damasceno|Presbítero y doctor de la Iglesia
12/6|O|w|St. Nicholas|Bishop||San Nicolás|Obispo
12/7|M|w|St. Ambrose|Bishop and Doctor of the Church||San Ambrosio|Obispo y doctor de la Iglesia
12/8|S|w|The Immaculate Conception of the Blessed Virgin Mary|Patronal feast of the United States|immaculate|Inmaculada Concepción de la Bienaventurada Virgen María|Fiesta patronal de los Estados Unidos
12/9|O|w|St. Juan Diego Cuauhtlatoatzin|Visionary of Our Lady of Guadalupe||San Juan Diego|
12/10|O|w|Our Lady of Loreto|||Bienaventurada Virgen María de Loreto|
12/11|O|w|St. Damasus I|Pope||San Dámaso I|Papa
12/12|F|w|Our Lady of Guadalupe|Patroness of the Americas||Bienaventurada Virgen María de Guadalupe|Patrona de las Américas
12/13|M|r|St. Lucy|Virgin and martyr||Santa Lucía|Virgen y mártir
12/14|M|w|St. John of the Cross|Priest and Doctor of the Church||San Juan de la Cruz|Presbítero y doctor de la Iglesia
12/21|O|w|St. Peter Canisius|Priest and Doctor of the Church||San Pedro Canisio|Presbítero y doctor de la Iglesia
12/23|O|w|St. John of Kanty|Priest||San Juan de Kety|Presbítero
12/26|F|r|St. Stephen|The first martyr||San Esteban|Protomártir
12/27|F|w|St. John|Apostle and Evangelist||San Juan|Apóstol y evangelista
12/28|F|r|The Holy Innocents|Martyrs||Santos Inocentes|Mártires
12/29|O|r|St. Thomas Becket|Bishop and martyr||Santo Tomás Becket|Obispo y mártir
12/31|O|w|St. Sylvester I|Pope||San Silvestre I|Papa
`;
