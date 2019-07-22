CREATE TABLE IF NOT EXISTS users (
user_pk                 SERIAL NOT NULL PRIMARY KEY,
user_username           VARCHAR(80) NOT NULL,
user_fname              VARCHAR(80) NOT NULL,
user_lname              VARCHAR(80) NOT NULL,
user_email              VARCHAR(80) NOT NULL UNIQUE,
user_hash               VARCHAR(255) NOT NULL,
user_signup             DATE NOT NULL,
user_last_signin        DATE NOT NULL,
user_security_question  TEXT NOT NULL,
user_security_answer    VARCHAR(80) NOT NULL
);

CREATE TABLE IF NOT EXISTS keywords (
kword_pk        SERIAL NOT NULL PRIMARY KEY,
kword_name      VARCHAR(50) NOT NULL,
kword_user_fk   INT
);

CREATE TABLE IF NOT EXISTS entries (
    entry_pk        SERIAL NOT NULL PRIMARY KEY,
    entry_user_fk   INT NOT NULL,
    entry_date      DATE NOT NULL DEFAULT NOW(),
    entry_text      TEXT NOT NULL,
    entry_isshared  BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS pendingEntries (
    pending_user_fk   INT NOT NULL,
    pending_text      TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
    tag_pk          SERIAL NOT NULL PRIMARY KEY,
    tag_kword_fk    INT NOT NULL,
    tag_entry_fk    INT NOT NULL
);

CREATE TABLE IF NOT EXISTS comments (
    comment_pk          SERIAL NOT NULL PRIMARY KEY,
    comment_entry_fk    INT NOT NULL REFERENCES entries(entry_pk),
    comment_user_fk   INT NOT NULL REFERENCES users(user_pk),
    comment_date      DATE NOT NULL DEFAULT NOW(),
    comment_text      TEXT NOT NULL
);
 

INSERT INTO keywords (kword_name, kword_user_fk) values ('Faith', 0);
INSERT INTO keywords (kword_name, kword_user_fk) values ('Hope', 0);
INSERT INTO keywords (kword_name, kword_user_fk) values ('Charity', 0);
INSERT INTO keywords (kword_name, kword_user_fk) values ('Courage', 0);
INSERT INTO keywords (kword_name, kword_user_fk) values ('Kindness', 0);
INSERT INTO keywords (kword_name, kword_user_fk) values ('Gladness', 0);
INSERT INTO keywords (kword_name, kword_user_fk) values ('Family', 0);
INSERT INTO keywords (kword_name, kword_user_fk) values ('Funny', 0);

INSERT INTO entries (entry_user_fk, entry_date, entry_text) VALUES (27, '07/01/19', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Malesuada nunc vel risus commodo. Interdum consectetur libero id faucibus nisl tincidunt eget nullam. Arcu cursus euismod quis viverra nibh cras pulvinar mattis. Nulla facilisi morbi tempus iaculis urna. Nullam non nisi est sit amet facilisis magna.' );
INSERT INTO entries (entry_user_fk, entry_date, entry_text) VALUES (27, '07/03/19', 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere' );
INSERT INTO entries (entry_user_fk, entry_date, entry_text) VALUES (27, '07/05/19', 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure? On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee' );
INSERT INTO entries (entry_user_fk, entry_date, entry_text) VALUES (27, '07/07/19', 'The European languages are members of the same family. Their separate existence is a myth. For science, music, sport, etc, Europe uses the same vocabulary. The languages only differ in their grammar, their pronunciation and their most common words. Everyone realizes why a new common language would be desirable: one could refuse to pay expensive translators. To achieve this, it would be necessary to have uniform grammar, pronunciation and more common words. If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual languages. The new common language will be more simple and regular than the existing European languages. It will be as simple as Occidental; in fact, it will be Occidental. To an English person, it will seem like simplified English, as a skeptical Cambridge friend of mine told me what Occidental is.The European languages are members of the same family. Their separate existence is a myth. For science, music, sport, etc, Europe uses the same vocabulary. The languages only differ in their grammar, their pronunciation and their most common words. Everyone realizes why a new common language would be desirable: one could refuse to pay expensive translators. To' );
INSERT INTO entries (entry_user_fk, entry_date, entry_text) VALUES (27, '07/09/19', 'The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex! Fox nymphs grab quick-jived waltz. Brick quiz whangs jumpy veldt fox. Bright vixens jump; dozy fowl quack. Quick wafting zephyrs vex bold Jim. Quick zephyrs blow, vexing daft Jim. Sex-charged fop blew my junk TV quiz. How quickly daft jumping zebras vex. Two driven jocks help fax my big quiz. Quick, Baz, get my woven flax jodhpurs! "Now fax quiz Jack!" my brave ghost pled. Five quacking zephyrs jolt my wax bed. Flummoxed by job, kvetching W. zaps Iraq. Cozy sphinx waves quart jug of bad milk. A very bad quack might jinx zippy fowls. Few quips galvanized the mock jury box. Quick brown dogs jump over the lazy fox. The jay, pig, fox, zebra, and my wolves quack! Blowzy red vixens fight for a quick jump. Joaquin Phoenix was gazed by MTV for luck. A wizards job is to vex chumps quickly in fog. Watch "Jeopardy!", Alex Trebeks fun TV quiz game. Woven silk pyjamas exchanged for blue quartz. Brawny gods just' );
INSERT INTO entries (entry_user_fk, entry_date, entry_text) VALUES (27, '07/11/19', 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections. The bedding was hardly able to cover it and seemed ready to slide off any moment. His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly as he looked. "Whats happened to me?" he thought. It wasnt a dream. His room, a proper human room although a little too small, lay peacefully between its four familiar walls. A collection of textile samples lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame. It showed a lady fitted out with a fur hat and fur boa who sat upright, raising a heavy fur muff that covered the whole of her lower arm towards the viewer. Gregor then turned to look out the window at the dull weather.' );
INSERT INTO entries (entry_user_fk, entry_date, entry_text) VALUES (27, '07/13/19', 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine. I am so happy, my dear friend, so absorbed in the exquisite sense of mere tranquil existence, that I neglect my talents. I should be incapable of drawing a single stroke at the present moment; and yet I feel that I never was a greater artist than now. When, while the lovely valley teems with vapour around me, and the meridian sun strikes the upper surface of the impenetrable foliage of my trees, and but a few stray gleams steal into the inner sanctuary, I throw myself down among the tall grass by the trickling stream; and, as I lie close to the earth, a thousand unknown plants are noticed by me: when I hear the buzz of the little world among the stalks, and grow familiar with the countless indescribable forms of the insects and flies, then I feel the presence of the Almighty, who formed us in his own image, and the breath');
INSERT INTO entries (entry_user_fk, entry_date, entry_text) VALUES (27, '07/15/19', 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar. The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious Semikoli, but the Little Blind Text didn''t listen. She packed her seven versalia, put her initial into the belt and made herself on the way. When she reached the first hills of the Italic Mountains, she had a last view back on the skyline of her hometown Bookmarksgrove, the headline of Alphabet Village and the subline of her own road, the Line Lane. Pityful a rethoric question ran over her cheek' );
