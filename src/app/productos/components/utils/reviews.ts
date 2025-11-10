

const reviews = [
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2twdFFuVnRXSFpmVFRKRVZuY3RXbE5YTms5alNVRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CAIQACodChtycF9oOkptQnVtWHZfTTJEVnctWlNXNk9jSUE%7C0cn2iyDGgIV%7C?hl=en",
    "review_text": "Buena asesoría de los señores Cristian y Alfred",
    "author_title": "ANTONIO GABRIEL BELTRAN",
    "author_id": "104297730573689693886",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2xkTlRrNUpPVEpFYjNKdVlrNUZkVlkzY2tkaWRFRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CAIQACodChtycF9oOldNTk5JOTJEb3JuYk5FdVY3ckdidEE%7C0cdBCt7Ufg3%7C?hl=en",
    "review_text": "Buen servicio del señor Alfredo panchi, se toma su tiempo en ayudar",
    "author_title": "Mercedes Agudelo",
    "author_id": "113555155921578897479",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2s1dWVrZHZZME5OZFZWTFZYRnFWazVWVVVacWVuYxAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CAIQACodChtycF9oOk5uekdvY0NNdVVLVXFqVk5VUUZqenc%7C0cbCWq77tl8%7C?hl=en",
    "review_text": "Buenas tardes compre una tableta samsung tab S10FE, en la tienda samsung c.c chipichape   haciendo claridad que en caso de requerir un cambio por tamaño se podría me dijo no hay ningún problema se puede acercar a cualquier tienda  samsung colombia, y la cambia siempre y cuando no sea usada.\n\nMe acerco a una tienda y me dicen que no es posible el cambio, por que esta destapada la caja y no realizan este tipo de cambio o acciones, cabe aclarar que los que destaparon la caja fueron ellos en la tienda.\n\nMe parece una falta de respeto que vendan con mentiras.\n\nMuy mal.....",
    "author_title": "D.",
    "author_id": "107933945872344341392",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnTURvbk1qY2p3RRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgMDonMjcjwE%7CCgsI9bCfwAYQ2P-jCA%7C?hl=en",
    "review_text": "Conoce los mejores productos, promociones y descuentos en nuestras tiendas. 😁",
    "author_title": "Compras ImagiQ",
    "author_id": "116458309416924351935",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnTURveUpYZ293RRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgMDoyJXgowE%7CCgwIvLiZwAYQkJ2SrgM%7C?hl=en",
    "review_text": "Excelentes productos",
    "author_title": "Emily Bernal",
    "author_id": "116157165549769951305",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnTUN3NTVxNUNnEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgMCw55q5Cg%7CCgwI0dP2vgYQyO-ZtgI%7C?hl=en",
    "review_text": "Excelentes productos, precios y ofertas. Me entregaron 1 televisor muy rápido. Gracias 🙂",
    "author_title": "Sebastian Suarez",
    "author_id": "103343339833840150233",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUNfamJEUVlREAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIC_jbDQYQ%7CCgsIyYmsvAYQuIzwSw%7C?hl=en",
    "review_text": "Excelente servicio al cliente.",
    "author_title": "Armando Stiven Ortiz Lesmes",
    "author_id": "107600454823550217840",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNfOWJpUmpBRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIC_9biRjAE%7CCgsIveOrvAYQyJKibQ%7C?hl=en",
    "review_text": "Excelente atención tanto comercial y servicio tecnico, recomendados!!!",
    "author_title": "Jennyfer Lisset Osorio Rodriguez",
    "author_id": "101163772024775043055",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUNfOWZEdmZnEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIC_9fDvfg%7CCgwI1uGrvAYQqNvaqgM%7C?hl=en",
    "review_text": "Me encanta sus productos  y servicio.",
    "author_title": "diana carolina",
    "author_id": "105844459246357646725",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNfNWJLNDVBRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIC_5bK45AE%7CCgwIiMOqvAYQiKCzzgE%7C?hl=en",
    "review_text": "Pésimo servicio en el CC el cacique.\nPedí un cotización para una dar uso a una garantía extendida de mi celular y se equivocaron en mi nombre. Necesitaba agregar una observación en dicha cotización y que arreglaran mi nombre pero según esta empresa los procesos internos no les permiten editar el documento porque la orden de servicio ya se cerró. Entonces ahora tengo q ingresar el dispositivo otra vez pagar 28.000 por el ingreso de mi celular (valor que ya habia pagado una primera vez) y que vuelvan a hacer una cotizacion que ya tienen y solo es corregir.\nNo los recomiendo para nada",
    "author_title": "Silvia Zappa",
    "author_id": "116660765268310639082",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSURmaWNIalVnEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIDficHjUg%7CCgwIy_j1uwYQgKCl-AE%7C?hl=en",
    "review_text": "Excelente atención",
    "author_title": "Yurleys Peña",
    "author_id": "103255949249548086307",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUQtZ3J2VEdBEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgID-grvTGA%7CCgwI98X1uwYQ2OPhqAI%7C?hl=en",
    "review_text": "Excelente servicio y atención",
    "author_title": "Laura Acevedo",
    "author_id": "105245223345447423241",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUQzNHFxRU1BEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgID34qqEMA%7CCgwI7orTuQYQoLmCsQE%7C?hl=en",
    "review_text": "Buen servicio",
    "author_title": "Ximena Otálora",
    "author_id": "110474216372456467178",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUQzNHNpa293RRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgID34sikowE%7CCgsIgIDTuQYQkLjfRA%7C?hl=en",
    "review_text": "Excelente servicio, gracias",
    "author_title": "Jhon Ramirez",
    "author_id": "118246064546689840057",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSURibnVqcm1nRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIDbnujrmgE%7CCgwIiLDEtQYQ6ODI5gE%7C?hl=en",
    "review_text": "Excelente servicio y asesoria ..todo en un solo lugar",
    "author_title": "Shirly Bastidas",
    "author_id": "111613309430321722641",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSURiN3VQMDVRRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIDb7uP05QE%7CCgwIp5jEtQYQiIHiowI%7C?hl=en",
    "review_text": "El mejor servicio de Samsung",
    "author_title": "Brian Stiben Mosquera Henao",
    "author_id": "113351522652600818645",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSURiN3YzVERREAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIDb7v3TDQ%7CCgwIy5bEtQYQsOWM6QE%7C?hl=en",
    "review_text": "Excelente 👌 servicio post",
    "author_title": "diego mantilla castellanos",
    "author_id": "111695912013756298535",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSURiN3QyT0NREAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIDb7t2OCQ%7CCgsIvZXEtQYQ-ODcaw%7C?hl=en",
    "review_text": "Increíble experiencia, excelentes precios.",
    "author_title": "Deyanira Giraldo",
    "author_id": "100059544601725377624",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSURiN3AzdlZnEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIDb7p3vVg%7CCgsIopXEtQYQ4Ju7Rw%7C?hl=en",
    "review_text": "Excelente servicio, rapidez en entregas y garantía en pos venta como ninguna otra marca.",
    "author_title": "BYRON CUBILLOS",
    "author_id": "108586463247230068323",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSURiN3AyNE5BEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIDb7p24NA%7CCgsI8JTEtQYQqKPZfw%7C?hl=en",
    "review_text": "Excelente experiencia y acompañamiento en los diferentes productos de Samsung",
    "author_title": "Ses Unicentro Pasto",
    "author_id": "100391629430369251742",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSURiN3MzU29nRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIDb7s3SogE%7CCgsIx5PEtQYQyOPiJQ%7C?hl=en",
    "review_text": "Excelente servicio, muy recomendado unicentro pasto",
    "author_title": "David Santander",
    "author_id": "115768769141570038554",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSURiN3JXMTBBRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIDb7rW10AE%7CCgwIsZLEtQYQkNaB1wM%7C?hl=en",
    "review_text": "Recomendado!",
    "author_title": "Dairo Alejandro Torres Garces",
    "author_id": "116090735340939050803",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUNNNzY3MWZBEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICM7671fA%7CCgsI_LCktQYQoOq2OQ%7C?hl=en",
    "review_text": "Me acerque a solicitar la garantía de mi celular y recibí una excelente atención del personal de la tienda, realizaron ciertas pruebas que permitieron  validar la novedad que ocurría con mi dispositivo móvil adicional realizaron el ingreso y en tres días hábiles mi equipo ya se encontraba reparado, me notificaron vía telefónica que ya podía acercarme a recogerlo.",
    "author_title": "Solangie Carolina Cely Naranjo",
    "author_id": "113787902734258955934",
    "review_rating": 4
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUNicDZMNUpBEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICbp6L5JA%7CCgwI4YektQYQ8LyYqwE%7C?hl=en",
    "review_text": "Fue espectacular,  recomendado el 100% , la mejor de mis experiencias",
    "author_title": "MARIA MARTINEZ BANCO BOGOTA GRUPO AVAL",
    "author_id": "103736050776485315297",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUNieDV2TVVBEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICbx5vMUA%7CCgwI9_KjtQYQkIHh_gE%7C?hl=en",
    "review_text": "Excelente servicio",
    "author_title": "IMQLady Ospina",
    "author_id": "106476420797421398550",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUNieF9IWGFREAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICbx_HXaQ%7CCgsI8eWjtQYQ8N7tfQ%7C?hl=en",
    "review_text": "Compramos un celular Galaxy S23FE y nos llegó a los pocos días junto con el obsequio prometido, felicitaciones excelente servicio",
    "author_title": "alba garcia",
    "author_id": "107366974283213196489",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNieDVqZDZRRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICbx5jd6QE%7CCgwIqNGjtQYQuJiEvgI%7C?hl=en",
    "review_text": "Excelente empresa, servicio excepcional lo recomiendo totalmente.",
    "author_title": "Danna Julieth Molina Martinez",
    "author_id": "115835388796737727055",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUQtd3UzZWFnEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgID-wu3eag%7CCgwI98-jtQYQ0JSmywM%7C?hl=en",
    "review_text": "Las entregas son rápidas y muy buen servicio, exelecentye servicio post venta",
    "author_title": "Mari Martinez",
    "author_id": "110548666092718755913",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUNyck1HbVpnEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICrrMGmZg%7CCgwIisybtAYQgL3rmAE%7C?hl=en",
    "review_text": "Es imposible contactarse con la empresa. Correo electrónico de servicio al cliente dañado. Teléfonos inactivos. Se nota que desactivaron los datos de contacto para evitar reclamaciones.\n\nYa la queja fue puesta en la Superintendencia de Industria y Comercio.",
    "author_title": "Jorge Andrés Ortigoza Ulloa",
    "author_id": "112943328999252600354",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSURMemZpQkx3EAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIDLzfiBLw%7CCgwIk4mAtAYQ-JOo9AE%7C?hl=en",
    "review_text": "Tenía mis dudas por algunos comentarios, pero la verdad que estuvo todo bien con mi compra de un TV, llegó rápido y sin contra tiempo",
    "author_title": "Henry Mosquera",
    "author_id": "109197440028820397014",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUREanNlaTFBRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIDDjsei1AE%7CCgwItfHUsAYQ0JyGvAI%7C?hl=en",
    "review_text": "Excelente atención por parte de todas las personas",
    "author_title": "María Alejandra Ospina Aguilera",
    "author_id": "110136279231311494025",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUM5LXFmWllBEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIC9-qfZYA%7CCgwI0P2YrwYQ6P_vngE%7C?hl=en",
    "review_text": "Recientemente entregué mi S20 FE para cambio de pantalla en el centro comercial Colina. Y puedo decir que el servicio es excepcional, se nota que son personas profesionales que se encargan de hacer estás reparaciones. Los precios son cómodos y valió cada peso invertido en la reparación que costó $490.000.",
    "author_title": "John",
    "author_id": "101610028294073189344",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUROdnVERl93RRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIDNvuDF_wE%7CCgwIrZW7rQYQiKLMgAE%7C?hl=en",
    "review_text": "En una preventa hace dos años, nunca me entregaron los tales ''obsequios'' que decian enviar con el celular. Ahora comprando otro equipo, se muestra que se realizó el pago pero no nos ha llegado confirmación o numero de orden, ni un correo ni nada. Intentamos contactarnos a los números, no sirven. En la página, en contacto escribimos y nada. En el whatsapp no contestan. Eviten EVITEN COMPRAR EN ESTE SITIO, MEJOR CON OTROS AUTORIZADOS, son lo peor de lo peor y no hay ni soporte, ni contacto ni nada.",
    "author_title": "Samantha Arias",
    "author_id": "112292344624624283186",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNWMzh5dTlRRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICV38yu9QE%7CCgwI3cnUqwYQ2Jzx8wE%7C?hl=en",
    "review_text": "Primera ves compro un televisor en esta página y la verdad me llego alos dos días fue muy rápido hasta el momento todo bien la recomiendo",
    "author_title": "Carlos Yesid",
    "author_id": "108358454652987217678",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSURGcEtuUzNBRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIDFpKnS3AE%7CCgwI0diaqgYQiO3cmQI%7C?hl=en",
    "review_text": "Lo mejor de lo mejor recomendado",
    "author_title": "Mauricio Torres",
    "author_id": "102933387214228510536",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNabWItOHd3RRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICZmb-8wwE%7CCgwIur-HqAYQyNCzmAE%7C?hl=en",
    "review_text": "Exelente servico al cliente / servicio tecnico colina lo mejor de samsung  ✰✰✰✰✰",
    "author_title": "Servicio Tecnico",
    "author_id": "110067747906526127061",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSURKXy1qYW5nRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIDJ_-jangE%7CCgwIu52CpgYQ8JPKjgI%7C?hl=en",
    "review_text": "Envian correo basura para robar informacion. Tengan cuidado.",
    "author_title": "Dany Depp",
    "author_id": "117947560547257114521",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSURodnBLaGFnEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIDhvpKhag%7CCgwI2JOpoAYQsJDP5wI%7C?hl=en",
    "review_text": "Llame a concretar un servicio técnico y elm operador fue grosero y no sabía responder a las dudas...",
    "author_title": "hernan gonzalez",
    "author_id": "113618724600736969822",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUNodWI3RUtBEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIChub7EKA%7CCgwIgK68nwYQqMGijgE%7C?hl=en",
    "review_text": "Me cumplieron en el tiempo de entrega pero el producto salió defectuoso y para la garantía hay que ir lejos. La dirección que aparece en internet nisiquiera es una tienda, es la parte administrativa y allá no pueden solucionar las fallas técnicas o defectos.",
    "author_title": "Brian G",
    "author_id": "114235517268086969514",
    "review_rating": 2
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSURCeXBqZ05REAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIDBypjgNQ%7CCgsIn6yVngYQuOeCLg%7C?hl=en",
    "review_text": "Pésimo servicio post venta, 8 días hábiles solo para agendar la visita técnica para un TV que se dañó a los 2.5 años de uso,  el servicio dura luego tiempo adicional, en resumen, mas de mes y medio para atender. Cabe mencionar que dicho TV fue comprado por el e-commerce de Samsung Colombia, manejado también por imagiq y fue la peor experiencia, el producto demoró en llegar más de un mes. Si samsung quiere hablar de buen servicio, su representante en Colombia es el peor ejemplo.",
    "author_title": "daniela abello",
    "author_id": "107924362430578085967",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSURCZ3V5ekpREAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIDBguyzJQ%7CCgsIw8SLngYQ2IflKQ%7C?hl=en",
    "review_text": "Mala experiencia de compra nunca me hicieron el plan recambio por un zflip 4",
    "author_title": "David Steven",
    "author_id": "114749031536505875265",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNCeGZtUzVnRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICBxfmS5gE%7CCgwItq68nQYQkKPr6QE%7C?hl=en",
    "review_text": "La busque en unicentro y en CC Santa fe y los locales no existen. Nunca encontré una sede de ellos.",
    "author_title": "Adri Ferro",
    "author_id": "116956404241102315741",
    "review_rating": 2
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUQtenJDTHVBRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgID-zrCLuAE%7CCgwI--OZnAYQ0LT65gI%7C?hl=en",
    "review_text": "Ojo con esta empresa dicen ser distribuidores de samsung pero las compra que realice por su pagina se pierden nadie responde la plata se pierde en pocas palabras es una estafa. Esta empresa ya esta denunciada en la superintendedncia de industria y comercio. Por favor abstengase de comprar a estos estafadores",
    "author_title": "alexander gomez",
    "author_id": "117959349931994775109",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSURHLXF2VXdnRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIDG-qvUwgE%7CCgwIsaaJnAYQ8L2wjwM%7C?hl=en",
    "review_text": "Excelentes productos, realice una compra de un celular y la entrega no superó las 14 horas, se encuentran muy buenas promociones.",
    "author_title": "Nathalia Cruz",
    "author_id": "106749256665296842812",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUQtd3FYdGx3RRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgID-wqXtlwE%7CCgwI2cj_mwYQsP_chgE%7C?hl=en",
    "review_text": "Excelente atención",
    "author_title": "Edwin Bolaños",
    "author_id": "103846086235757579487",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUQtd3BtbjZRRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgID-wpmn6QE%7CCgsIlsD_mwYQqIiFIQ%7C?hl=en",
    "review_text": "Excelente servicio",
    "author_title": "Maria Alejandra Alvarado Rojas",
    "author_id": "111033785393225765800",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUQtZ3R2WWZ3EAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgID-gtvYfw%7CCgwIt8v-mwYQkLrs9AE%7C?hl=en",
    "review_text": "Excelente servicio",
    "author_title": "Sergio Geovanny Sanchez Rodriguez",
    "author_id": "100611694519810124163",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUQtZ3BPZFlREAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgID-gpOdYQ%7CCgsImsP-mwYQwIanFQ%7C?hl=en",
    "review_text": "Es mi partner de confianza para comprar Celulares y accesorios Samsung",
    "author_title": "Carolina Lopez Morales",
    "author_id": "104223017202905052253",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUQtZ3ZTOTlRRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgID-gvS99QE%7CCgwIgfv9mwYQkOeFvgE%7C?hl=en",
    "review_text": "Buenos tiempos de entrega y precios promocionales, buena experiencia.",
    "author_title": "John Sebastian Nieves Pinzon",
    "author_id": "101320665168591178911",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSURlaVB2UWJnEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIDeiPvQbg%7CCgsIrMnbmQYQuOnCUA%7C?hl=en",
    "review_text": "Para la devolución del dinero no cumplen con los días establecidos que son 15 días hábiles, van 17 días hábiles y aun sin devolución del dinero.",
    "author_title": "Cristian camilo Ruiz Mejía",
    "author_id": "104740410840465598245",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNlemJuMzlBRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICezbn39AE%7CCgwIuPGnmQYQyJ623AM%7C?hl=en",
    "review_text": "Hice una compra, entregaron algo que no era, se hizo la devolucion y han pasado mas de 52 dias habiles (mas de 4 meses) y no contestan. No se recomienda comprar nada por esta plataforma, puede ser una estafa.",
    "author_title": "Oscar Diaz",
    "author_id": "106152690762450056492",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNlcG8tNm9nRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICepo-6ogE%7CCgwIl4n_mAYQyO78oAM%7C?hl=en",
    "review_text": "El servicio técnico es pésimo! El servicio al cliente peor, no responden los correos, no contestan las llamadas, se comprometen con tiempos de entrega que no cumplen, jamás lleven a arreglar un celular a ese lugar!",
    "author_title": "Daniela Lagos Prieto",
    "author_id": "112689338832818885290",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNlX09hNnlnRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICe_Oa6ygE%7CCgwI_enqmAYQ0KXP9gI%7C?hl=en",
    "review_text": "Me preocupaban tantas reseñas negativas que había leído, pero mi experiencia fue buena. El producto me llegó 4 días después de hacer la compra, en perfecto estado. La despachadora de envíos hacia Medellín es Coordinadora, con la cual nunca he tenido inconvenientes.",
    "author_title": "Julieta Isaza",
    "author_id": "101187290651901689017",
    "review_rating": 4
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNlZ0xMVmlnRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICegLLVigE%7CCgwIrYHKmAYQ2NbIkwM%7C?hl=en",
    "review_text": "Waste of time. Perdida de tiempo.",
    "author_title": "Presutti -",
    "author_id": "104420247471659976373",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUR1N2JpS1VnEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIDu7biKUg%7CCgwInKGlmAYQwIf9jgI%7C?hl=en",
    "review_text": "Muy mala experiencia con el servicio de esta empresa, tienen dos asesores en el punto de colina de una atención deplorable. En la zona norte este es uno de los dos puntos habilitados para servicio técnico y casi que es obligatorio recibir tan mala atención si se quiere reparar un equipo. Ante la pérdida del protector del celular mientras estaba el equipo en reparación la respuesta del asesor fue \" es cruel, pero nadie le va a responder\". Lamentable",
    "author_title": "Milton Leon",
    "author_id": "106658181227766287907",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUN1MTlMeldREAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICu19LzWQ%7CCgwIp6XGlwYQsICE6QE%7C?hl=en",
    "review_text": "Por lejos la peor experiencia de una compañía en toda mi vida. Realice la compra de un producto, hablan de 10 días hábiles para envío gratis, llevo 20 días de espera y todavía me dicen que no saben cuando llega y depende de samsung, tienen cero información de los productos y sus llegadas.\n\nNO LO RECOMIENDO EN NINGÚN CASO",
    "author_title": "Ricardo Garassini",
    "author_id": "114233711288311553544",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUN1dF9tREVnEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICut_mDEg%7CCgwIn6rFlwYQ0IKWggI%7C?hl=en",
    "review_text": "Excelente servicio, buena atención y responsabilidad con la marca, aveces un poco demorado, pero por la parte de colaboración a la hora de pasar información y configuraciones.",
    "author_title": "Jeisson Cárdenas (CJ CÁRDENAS'92)",
    "author_id": "113785270764277675620",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUN1dDhLT0x3EAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICut8KOLw%7CCgwIkobFlwYQkLvs5gE%7C?hl=en",
    "review_text": "De acuerdo... incumplidos, mala atención. PESIMA EXPERIENCI. Cero recomendado",
    "author_title": "Claudia Patricia Ordoñez Ruiz",
    "author_id": "105832183777603230688",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUNPck02TFF3EAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICOrM6LQw%7CCgwIpqHplAYQoMGsrQI%7C?hl=en",
    "review_text": "Por si alguien se pregunta por una reseña reciente de esta compañía acá está. El servicio de entrega ha mejorado sus productos llegan el tiempo. Ahora el problema principal por el que pasan es que sus reembolsos se demoran una eternidad y cobran un monto mayor  que el de sus supuestas \"promociones\". Los trámites administrativos son terriblemente lentos y sus líneas de atención están infectadas de jóvenes con una actitud nefasta... Le recomiendo que busque otro \" partner de confianza\" porque está compañía no lo será",
    "author_title": "Gael Daniel Sánchez",
    "author_id": "117615255680569176706",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUMyaE5peXZ3RRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIC2hNiyvwE%7CCgsIvPXVkgYQoLvXTw%7C?hl=en",
    "review_text": "Dos meses esperando mi pedido. Que cosa tan horrible esta empresa. Samsung debería cambiar.",
    "author_title": "Ely Navarro Julio",
    "author_id": "107122535628399701767",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSURXdjl2dzFBRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIDWv9vw1AE%7CCgwIqKTCkgYQ4NqYnwE%7C?hl=en",
    "review_text": "Son unos estafadores, compré un celular samsu g, nunca me lo entregaron y tampoco me devolvieron el dinero,",
    "author_title": "Lorena Rodríguez",
    "author_id": "100185702735773389238",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSURXeTREN1JREAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIDWy4D7RQ%7CCgsInduqkgYQgODRBA%7C?hl=en",
    "review_text": "Pésimo, absolutamente vergonzoso el servicio que presta imagiq. Hace más de un mes compré un teléfono por la página oficial de Samsung en el cual me habían confirmado un fecha de entrega que no cumplieron, desde entonces me he comunicado casi a diario por 3 semanas y la respuesta es siempre que el producto se encuentra en despacho, que en 1 o 2 días lo debería estar recibiendo, dan números de guías de envío que no existen para embolatar al cliente y hacerle creer que si están gestionando au pedido. 3 SEMANAS EN EL MISMO CUENTO! Y NO HAN ENTREGADO ABSOLUTAMENTE NADA.\nAhora cuando llamo a averiguar de mi producto simplemente me tiran el teléfono. Nadie sabe nada, nadie responde por el pedido. Y hasta la fecha no tengo ni mi producto ni mi reembolso. Jamás compren con ellos!",
    "author_title": "Hernán Rodríguez",
    "author_id": "111037974470085158427",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNXcXZDRHdnRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICWqvCDwgE%7CCgsInqrZkAYQgMnYIA%7C?hl=en",
    "review_text": "Incumplen los tiempos de entrega",
    "author_title": "Brian Caica",
    "author_id": "114706451901815814180",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUQ2a3NMWEZREAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgID6ksLXFQ%7CCgwIu6m5igYQqMv4iQI%7C?hl=en",
    "review_text": "Después de un mes de compra en promoción y pago de nevecon , me dicen q no tienen el producto y que me harán devolución de dinero que hasta la fecha no han realizado",
    "author_title": "BLANCA HELENA Navarrete",
    "author_id": "109089976263132161647",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUM2NV9xYWN3EAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIC65_qacw%7CCgsIxauEigYQ8M_HOA%7C?hl=en",
    "review_text": "Malísima la atención y  respuesta de los casos. Y hasta el asesor lo regaña a uno porque llevo mas de un mes esperando el producto que les compre y aun nada que dan respuesta",
    "author_title": "Juan Camilo Zapata Tobon",
    "author_id": "112986281049172218853",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUM2d3Nxdk13EAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIC6wsqvMw%7CCgwIgo7diQYQ4IeF9AE%7C?hl=en",
    "review_text": "Imagiq (Samsung en Colombia) publica mensajes engañosos para que adquieras productos y luego no cumplen sus promesas. Sigo esperando, luego de tres meses  redimir el supuesto bono de 800 mil pesos por haber comprado un teléfono móvil. NO SE DEJEN ENGAÑAR. #samsungcolombiaengaña",
    "author_title": "Oscar Fernando Rodriguez Bernal",
    "author_id": "115565020388705833953",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUR5alllVHB3RRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIDyjYeTpwE%7CCgsI7fW-ggYQkL3VKw%7C?hl=en",
    "review_text": "En la página publican cosas que no tienen, y después más de un mes esperando el reembolso.",
    "author_title": "Felipe González",
    "author_id": "110626006213855735687",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUNpcHJldWFnEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICipreuag%7CCgsI5IP2_AUQkNe6Pw%7C?hl=en",
    "review_text": "Me cancelaron un pedido y no me han devuelto la plata, jamás compren ni confíen en este operador logístico, Samsung cayó muy bajo con este proveedor",
    "author_title": "Felipe Garcia",
    "author_id": "115568096239652217520",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNDOV9HQm1BRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICC9_GBmAE%7CCgsIjLra-gUQiMzaTQ%7C?hl=en",
    "review_text": "Pesimo servicio, llevo 2 semanas esperando un pedido y por ninguna parte contestan, los telefonos que publican no funcionan y en el chat de servicio al cliente no dan soluciones. No puede ser que una empresa tan grande como es Samsung funcione con estos incompetentes. No compren en las tienda online de samsung colombia.",
    "author_title": "Sebastián Álvarez Correa",
    "author_id": "113015270462065755298",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUQ4dl9PS0NBEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgID8v_OKCA%7CCgsIqMyr-QUQgMHsNg%7C?hl=en",
    "review_text": "NO RESPONDEN POR NADA, SIEMPRE DAN EVASIVAS DESPUÉS DE COMPRAR EN SAMSUNG",
    "author_title": "Lorena Marquez Gamarra (P R I N F R E X I T A)",
    "author_id": "105159233698269344892",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUQ4d19ISVV3EAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgID8w_HIUw%7CCgwIh-f8-AUQuL2LgwE%7C?hl=en",
    "review_text": "deben enviar correo a crm@imagiq.co",
    "author_title": "olga bautista",
    "author_id": "105893703836161250094",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUM4M2FfS21nRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIC83a_KmgE%7CCgwIx4Os-AUQ6L7E9gI%7C?hl=en",
    "review_text": "Llevo 2 semanas llamando y nadie responde. Ni siquiera me entregaron factura de mi.compra. Pésimo servicio y atención al cliente.",
    "author_title": "CARLOS ANDRES SANCHEZ",
    "author_id": "102704937887008293286",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUM4dnR6LWN3EAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIC8vtz-cw%7CCgwI87yT-AUQ-ImI5AE%7C?hl=en",
    "review_text": "No contestan por ningun media, he enviado 3 correos y llevo todo el dia llamando a su linea telefónica y tal parece que es un numero fantasma. PESIMO SERVICIO! NO COMPREN ON LINE CON SAMSUNG, PORQUE SU SOPORTE DE VENTAS ON LINE EQUE ES ESTA SUPUESTA EMPRESA LLAMADA IMAGIQ  NO ESTAN DISPUESTOS A BRINDAR SOPORTE EN NINGUN MOMENTO.",
    "author_title": "Luis B Rincon",
    "author_id": "111164610495652076865",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUM4cXBDV0NBEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIC8qpCWCA%7CCgwI-e_z9wUQgN3E2QE%7C?hl=en",
    "review_text": "Pésimo servicio al cliente, se demoran en la entrega de productos y en ninguno de sus canales de atención al cliente responden, es increíble que Samsung Colombia confíe en esta empresa para el manejo de su tienda online.",
    "author_title": "Carlos M. Gómez",
    "author_id": "102825625181265552599",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUM4MU5XM1FnEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIC81NW3Qg%7CCgsIwN7S9wUQwMfnMA%7C?hl=en",
    "review_text": "No responden numeros de contacto y tampoco responde correos electrónicos, pésimo servicio.",
    "author_title": "Andres Sierra",
    "author_id": "107463964542708501773",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUNNXzZiQ1B3EAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICM_6bCPw%7CCgsI4qHG7wUQsMf3Ig%7C?hl=en",
    "review_text": "Muy contento con el excelente servicio prestado , quede satisfecho con la atención ya que suplieron todas las dudas que tenía y finalmente obtuve el el producto que tanto quería !!",
    "author_title": "walter duarte",
    "author_id": "111174055364464459271",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNNdjZ6TXJ3RRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICMv6zMrwE%7CCgwIu7nE7wUQ4NOQ2gE%7C?hl=en",
    "review_text": "Excelentes por su servicio técnico, tiempos de\nentrega de sus productos, atención al cliente, excelente portafolio.",
    "author_title": "Yheyhe Triana",
    "author_id": "102439445756924492536",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNNNy03UXlRRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICM7-7QyQE%7CCgsIzrbA7wUQkICmeQ%7C?hl=en",
    "review_text": "Excelente servicio técnico, muy confiables y siempre atentos a resolver cualquier inquietud. La recomiendo",
    "author_title": "Camila Garzon Acosta",
    "author_id": "117145908864491569674",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNNcjRyemdRRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICMr4rzgQE%7CCgwIyq3A7wUQ4Nrq1AI%7C?hl=en",
    "review_text": "Su servicio técnico es muy cumplido en los días establecidos, además mi teléfono fue analizado a profundidad y reparado perfectamente.",
    "author_title": "Dana Aguilera",
    "author_id": "116778428067762505480",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNNN19pdmlRRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICM7_iviQE%7CCgwI2-2_7wUQiOmclgE%7C?hl=en",
    "review_text": "Recibí una excelente atención del personal y cumplimiento de tiempos establecidos :)",
    "author_title": "Luisa Florez",
    "author_id": "118230057379686523368",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUN3NTRHMzFRRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICw54G31QE%7CCgwI1Ou_7wUQoKHZ5wI%7C?hl=en",
    "review_text": "El servicio al cliente sigue excelente. oportuna respuesta y tiempos de entrega ideales",
    "author_title": "Mauricio Bernal Daza",
    "author_id": "103303458433795151229",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNNcjl2MmtRRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICMr9v2kQE%7CCgsI97q_7wUQgPqIUQ%7C?hl=en",
    "review_text": "En el ultimo open house compre un Samsung Galaxy Watch y me llego super a tienda, la atención fue super cordial ! 100% recomendados",
    "author_title": "Maria Carolina Garcia Rueda",
    "author_id": "100821049343836425699",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNNcjV2ZmpBRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICMr5vfjAE%7CCgwIqrq_7wUQiM7drQE%7C?hl=en",
    "review_text": "Son un Bacanes todos, el mejor servicio al cliente y además hay servicio técnico, es mejor que un ishop",
    "author_title": "jorge vargas",
    "author_id": "107867976212329354314",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNNcjV1TWh3RRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICMr5uMhwE%7CCgsInrm_7wUQqOLDLA%7C?hl=en",
    "review_text": "Buen servicio, oportunos con los tiempos. He realizado compras en parque colina y la atención a sido excelente.",
    "author_title": "Andres Camacho",
    "author_id": "105154162101239032869",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNNcjh1LWhnRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICMr8u-hgE%7CCgwIu7W_7wUQ6MmMwgI%7C?hl=en",
    "review_text": "Excelente Experiencia muy Rápido el tiempo de Reparación me lo entregaron antes de lo acordado!!",
    "author_title": "carlos jose consuegra jimenez",
    "author_id": "103429089972321067951",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUNNcl96UVB3EAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICMr_zQPw%7CCgwIwp-_7wUQ8Onz2wE%7C?hl=en",
    "review_text": "Hice la compra de un televisor por la pagina Samsung, cumplieron con los tiempos de entrega. Excelente",
    "author_title": "María Alejandra Munévar",
    "author_id": "112190441849717574211",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUNNcjlYTlhBEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICMr9XNXA%7CCgwIspu_7wUQ6P3_hQM%7C?hl=en",
    "review_text": "Lo recomiendo fue una muy buena experiencia, desde su ingreso fui abordado por un asesor quien muy amablemente atendió mi solicitud y direcciono a la persona encargada de servicio técnico la cual me dio una solución inmediata superando así  todas mis expectativas. Excelente servicio",
    "author_title": "Eduar Castillo",
    "author_id": "112883796200956925970",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNNcjltVGh3RRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICMr9mThwE%7CCgsIsJG_7wUQ2PGleA%7C?hl=en",
    "review_text": "excelente servicio post venta y un amplio conocimiento en sus productos son los mejores aca en cali",
    "author_title": "Jose Luis Medina Erazo",
    "author_id": "100270583155582055063",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNNcjVuTi1nRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICMr5nN-gE%7CCgsIgZC_7wUQuJbGSg%7C?hl=en",
    "review_text": "La entrega de la lavadora  que compré fue oportuna y con un excelente el servicio de seguimiento a mi pedido.",
    "author_title": "Juan Felipe Mondragón Q.",
    "author_id": "104726684614449415865",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChRDSUhNMG9nS0VJQ0FnSUNNcjVrbBAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICMr5kl%7CCgsI94-_7wUQsOCaWg%7C?hl=en",
    "review_text": "Excelente atención en los servicios tanto en venta como servicios técnicos y muy bien punto para visitar los invito a que se acerquen",
    "author_title": "hendrix eizaga",
    "author_id": "111898806271567716158",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUNNcjhuek93EAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICMr8nzOw%7CCgwIuIy_7wUQ-OfbsAE%7C?hl=en",
    "review_text": "Lleve mi celular a Reparación, considero que realizaron un trabajo profesional y a la altura de la marca que Representan, cumplieron los días de reparación y sobre todo me atendieron con mucha amabilidad y profesionalismo. Excelente servicio Recomendado 100% a todos.. Gracias.",
    "author_title": "Ricardo Andrade",
    "author_id": "112574119848532155620",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNNcjdIVHNnRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICMr7HTsgE%7CCgsI3oi_7wUQ-OWiYg%7C?hl=en",
    "review_text": "La atención es excelente, el  personal muy amable y dispuesto a ayudar ante cualquier duda, la atención es muy rápida y eficaz, los recomiendo.",
    "author_title": "Andres Florez.",
    "author_id": "110891731335854695815",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNNcjlHMnJRRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICMr9G2rQE%7CCgsIjIe_7wUQyNbnCQ%7C?hl=en",
    "review_text": "Excelente servicio, reparaciones 100% garantizadas!! ,  Calidad en sus productos, y cumplimiento en los tiempos de entrega, Totalmente  recomendados!",
    "author_title": "Ronald Rodriguez",
    "author_id": "111229741508502141837",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUNNcjlIYWJnEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICMr9Habg%7CCgwI94a_7wUQkKW9iQE%7C?hl=en",
    "review_text": "Una experiencia memorable, excelente atención, increíbles productos y la asesoría impecable. 👍🏼Super recomendado",
    "author_title": "camilo salazar",
    "author_id": "103760381036448067722",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUNNcjVHOU13EAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICMr5G9Mw%7CCgwImYa_7wUQqMfx8AE%7C?hl=en",
    "review_text": "La tienda presta un excelente servicio. Los asesores brindan un muy buen acompañamiento.",
    "author_title": "Luis Eduardo Quintero",
    "author_id": "104981989582682874348",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUNNcjhHQVV3EAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICMr8GAUw%7CCgsIyIG_7wUQoKPpIg%7C?hl=en",
    "review_text": "Exelente servicio, fue muy rápida la entrega. Estoy muy contenta con los productos que compré.",
    "author_title": "Yeimy Ramos",
    "author_id": "107555524335254678878",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNNcjc3QTVRRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICMr77A5QE%7CCgwI4v2-7wUQ8IW-1gM%7C?hl=en",
    "review_text": "Genial el servicio y la atención prestada se interesan en el cliente hasta la entrega del celular o accesorio me prestan el servicio de pasar información de mi antiguo equipo al nuevo me sentí muy cómodo con todo el personal",
    "author_title": "reivud729",
    "author_id": "100455912332338968473",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUNNcjlyV1R3EAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICMr9rWTw%7CCgwIwum-7wUQgIejswI%7C?hl=en",
    "review_text": "Excelente servicio, son muy puntuales y la atención a cliente es excepcional.",
    "author_title": "angela paola silva jimenez",
    "author_id": "111551836801083604723",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUNNci1yZWFnEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICMr-reag%7CCgsIkOe-7wUQ2IW3AQ%7C?hl=en",
    "review_text": "Los productos que ordene llegaron dentro del tiempo esperado",
    "author_title": "Johanna Castiblanco",
    "author_id": "101602554325091165096",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNNcjRyMDJBRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICMr4r02AE%7CCgwIm-O-7wUQ0KzH6gI%7C?hl=en",
    "review_text": "me gusta mucho los  productos de buena calidad",
    "author_title": "LAURA DAYANNA PATINO GOMEZ",
    "author_id": "108761062207988164301",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNNcl9MNXpRRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICMr_L5zQE%7CCgwIxuK-7wUQgIbirwE%7C?hl=en",
    "review_text": "He comprado ya varias veces en las páginas oficiales de SAMSUNG y el servicio fue excelente. Muy recomendados!",
    "author_title": "Daniel Escobar",
    "author_id": "109566079890399881253",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUNNcjR6SVNnEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICMr4zISg%7CCgwI7s--7wUQ6OCw7gE%7C?hl=en",
    "review_text": "Execelente servicio, productos originales de la mano con Samsung.",
    "author_title": "Nicole Menjura",
    "author_id": "100330673073549960515",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUQwNk96a2RBEAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgID06OzkdA%7CCgwI39yz7QUQ-PWx9AE%7C?hl=en",
    "review_text": "Muy cumplidos con la entrega del Note 10 Plus, sin ningún inconveniente. Mil gracias",
    "author_title": "Yoan Ocampo",
    "author_id": "102678993967436867925",
    "review_rating": 5
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUMwMHZiSTZnRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIC00vbI6gE%7CCgsIvMuV7AUQ2Ly0aw%7C?hl=en",
    "review_text": "Pésimo servicio. Incumplidos con las fechas de entrega. No respetan ni su propia política de despachos. Gestión deficiente. Empresa para nada confiable. No comprar aquí si no qieren perder su dinero y su tiempo.",
    "author_title": "Felino Mascalabrocha",
    "author_id": "116715242343526806379",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUMwdkx1Y3hRRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIC0vLucxQE%7CCgsIv8eK7AUQwIebCw%7C?hl=en",
    "review_text": "Horrible el servicio no cumplen con fechas de entrega llevo 10 días esperando mi celular no se si me robaron no responden los correas",
    "author_title": "nathy garcia",
    "author_id": "114785093352218104679",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUMwN0k2NGtRRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIC07I64kQE%7CCgwIseyE7AUQoIGvxAE%7C?hl=en",
    "review_text": "Pésimo servicio. No saben cuando llegan sus productos, su teléfono de contacto no sirve e incumplen los plazos dados.",
    "author_title": "Juan Sebastian Castellanos",
    "author_id": "107287747989713612765",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUMwaktMRy1nRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIC0jKLG-gE%7CCgwIvMn_6wUQgOKXnAM%7C?hl=en",
    "review_text": "No hay  forma de comunicarse con ellos,  los tiempos de entrega son muy  largos.\nTienen un servicio HORRIBLE!",
    "author_title": "viviam osorio",
    "author_id": "110681459841781485233",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSUMwOU5Ld2ZREAE!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIC09NKwfQ%7CCgwI66r-6wUQiMfyiAI%7C?hl=en",
    "review_text": "pésimos representantes de Samsung, no saben cuando llegan sus productos, dan 10 fechas al azar, y en ninguna cumplen, guías inexistentes..en fin..",
    "author_title": "Ing.Wilver P.",
    "author_id": "115265156042766090107",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNVbU9tVzhRRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICUmOmW8QE%7CCgwIofO36QUQuLnYxQM%7C?hl=en",
    "review_text": "Del teléfono que \"compre\", sólo llegó la caja y los accesorios",
    "author_title": "Marcos Soriano",
    "author_id": "105049796121468717485",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSURvbzZDQ29RRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIDoo6CCoQE%7CCgwIpM_E5AUQ8N-AvQE%7C?hl=en",
    "review_text": "Pesimos, nunca llega nada a tiempo! Aparte no conocen lo que es servicio al cliente!",
    "author_title": "Martin Velez",
    "author_id": "100329769592729418715",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSURvanVIUm9nRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgIDojuHRogE%7CCgwI0Kew5AUQ6Mb5mwM%7C?hl=en",
    "review_text": "Muy lentos en los despachos",
    "author_title": "DVMZCS",
    "author_id": "105202776257854757097",
    "review_rating": 1
  },
  {
    "review_link": "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnSUNJeDdMSjBBRRAB!2m1!1s0x0:0xba44c7a6a3df66c3!3m1!1s2@1:CIHM0ogKEICAgICIx7LJ0AE%7CCgsIybq54AUQtJPzbQ%7C?hl=en",
    "review_text": "muy demorados.",
    "author_title": "Valentina acevedo castro",
    "author_id": "100862099784504167259",
    "review_rating": 2
  }
]

export default reviews