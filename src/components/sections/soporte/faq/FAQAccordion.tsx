"use client";

import { useState } from "react";

const faqItems = [
  {
    title: "1. Definiciones",
    content: `Para los efectos de estos Términos y Condiciones, se tendrán en cuenta las definiciones que a continuación se mencionan, sin importar si se usan en singular o plural:

"Centro de Servicio Autorizado" Significa los establecimientos autorizados por Samsung para la prestación de servicios técnicos en torno a los Productos.

"Condiciones Particulares de Venta" significan las condiciones que aplican a cada Producto en específico. Dichas condiciones incluyen, pero no se limitan a, el precio, el tiempo de entrega, el tiempo de garantía, entre otros.

"Cookies" significan los archivos de datos que se almacenan en el disco duro de la computadora del Usuario cuando éste tiene acceso al Portal.

"Contenidos" significa sin limitación, todos los textos, imágenes, audiogramas, videogramas, gráficas, marcas y diseños (así como todas sus mejoras, suplementos, actualizaciones, revisiones y/o correcciones) incluidos en un Marco o en una página de internet.

"Contrato" significa los presentes Términos y Condiciones de uso respecto del Portal, según los mismos sean modificados, adicionados o complementados, de tiempo en tiempo.

"Destinatario" significa la persona designada por cualquier persona para recibir un Mensaje de Datos.

"Marco" significa el recuadro, utilizado generalmente para fines publicitarios y/o con el objeto de modificar la imagen de una página de internet, sobrepuesta a dicha página de internet, permitiendo visualizar la misma fuera del dominio principal en que se encuentre hospedada.

"Mensaje de Datos" significa la información generada, enviada, recibida o archivada por medios electrónicos, ópticos o cualquier otra tecnología.

"Métodos de Pago" significa los mecanismos ofrecidos por Samsung para la compra de Productos a través del Portal.

"Samsung" significa Samsung Electronics Colombia S.A.

"Servicios" significa, conjuntamente, cualquier servicio que sea ofrecido al Usuario a través del Portal.

"Terceros" significa cualquier persona distinta a las partes del Contrato.

"Sitio" significa un conjunto de Páginas de Internet ubicadas o identificadas bajo un mismo dominio principal URL.

"Partes" significa, conjuntamente Samsung y el Usuario.

"Productos" significan los productos de la marca Samsung que se comercializan en el Portal.

"Portal" significa el portal de comercio electrónico operado por Samsung en el siguiente enlace https://www.samsung.com/co/.

"URL" significa, por sus siglas en inglés Uniform Resource Locator.

"Usuario" significa toda persona que accede al Portal en su carácter de destinatario final, con el propósito de adquirir cualquier producto o servicio de Samsung.`,
  },
  {
    title: "2. Funcionamiento del portal",
    content: `Este Portal puede ser navegado desde diversos países, no obstante, Samsung aclara que los Productos y Servicios ofrecidos a través del Portal serán válidos única y exclusivamente en el territorio colombiano y sujetos a la disponibilidad de los mismos en la República de Colombia.

2.1 Acceso al Portal y aceptación de los Términos y Condiciones

Al acceder al Portal o hacer uso del mismo, el Usuario inequívocamente manifiesta su aceptación a sujetarse a los Términos y Condiciones, así como su adhesión plena y sin reserva a los mismos.

Las actividades que realice el Usuario a través del Portal se rigen por estos Términos y Condiciones. Por ende, los Términos y Condiciones delimitan los derechos y obligaciones de los Usuarios que ingresen al Portal.

Samsung se reserva el derecho a negar, restringir o condicionar al Usuario el acceso al Portal, total o parcialmente, sin previo aviso. Adicionalmente, teniendo en cuenta que el acceso y funcionamiento del Portal están sujetos a procesos técnicos, Samsung no garantiza el acceso ininterrumpido del Usuario al Portal.

El Usuario, para comprar un Producto a través del Portal, debe cumplir previamente con los siguientes requisitos:

1. Ser legalmente capaz de acuerdo a la legislación vigente;
2. Ser mayor de edad al momento de acceder y hacer compras por el Portal;
3. Estar residenciado en la República de Colombia.
4. Aceptar y cumplir con los Términos y Condiciones, así como autorizar el tratamiento de sus datos personales de acuerdo con lo dispuesto por la Política de Tratamiento de la Información disponible en https://www.samsung.com/co/info/privacy/

2.2 Productos ofrecidos a través del Portal

A través del Portal, Samsung ofrece Productos nuevos de la marca Samsung y marcas aliadas. Los Productos incluyen empaques, etiquetas, instructivos y advertencias que contienen las indicaciones claras y precisas para su uso normal, conservación, mejor aprovechamiento, manejo seguro y confiable, así como las pólizas de garantía correspondientes.

Toda la información acerca de los Productos contenida en el Portal se proporciona únicamente con fines informativos. Antes de usar los Productos se recomienda leer las etiquetas, advertencias e instrucciones de uso de cada Producto.`,
  },
  {
    title: "3. Compra de productos a través del portal",
    content: `Para poder realizar la compra de los Productos el Usuario deberá realizar el pago del precio de los Productos seleccionados incluyendo impuestos y los gastos que claramente se especifiquen, a través de los Métodos de Pago que Samsung ponga a disposición del Usuario en el Portal.

Los precios de los Productos pueden ser modificados a discreción de Samsung, modificación que se verá reflejada de manera oportuna sin afectar las ventas que ya fueron realizadas. Esto implica que no se verán modificadas las operaciones de venta en curso o las compras específicas iniciadas o realizadas previo a la modificación del precio. Adicionalmente, la compra de los Productos puede generar gastos de envío. Estos gastos estarán claramente indicados en las Condiciones Particulares de Venta de cada Producto indicándose si dichos costos deberán ser asumidos por el Usuario.

El Usuario solamente podrá comprar Productos a través del Portal para ser entregados dentro del territorio colombiano, en las ciudades y municipios disponibles al momento de hacer el pago de los Productos.

En caso de conflicto o contradicción entre los presentes Términos y Condiciones, y las Condiciones Particulares de Venta, estas últimas prevalecerán sobre los primeros. El Usuario debe leer con atención las Condiciones Particulares de Venta, las cuales se entenderán aceptadas en el momento en el que el Usuario proceda al pago de los Productos. Tras realizar su compra, Samsung le enviará la factura correspondiente a su correo electrónico. El Usuario debe revisar los datos de facturación antes de confirmar su compra, pues no será posible realizar cambios en la factura. En caso de tener alguna duda, el Usuario puede comunicarse a los números #726, (601) 6001272 y 018000112112.

Todos los Productos ofertados en el Portal están sujetos a disponibilidad y se ofrecen hasta agotar existencias. En caso de que el Producto adquirido por el Usuario ya no se encuentre disponible, Samsung informará al Usuario de tal situación y reembolsará al Usuario la cantidad pagada por el Producto adquirido, según el Método de Pago utilizado.`,
  },
  {
    title: "4. Precios de los productos incluidos en el portal",
    content: `Los precios de los Productos ofertados en el Portal incluyen el Impuesto al Valor Agregado, salvo que se indique expresamente lo contrario y que la Ley exija alguna modalidad especial de información. Para poder realizar la compra de los Productos, el Usuario deberá realizar el pago del precio de los Productos seleccionados incluyendo impuestos y los gastos que claramente se especifiquen, a través de los Métodos de Pago que Samsung ponga a disposición del Usuario en el Portal. Una vez autorizado y validado el pago, Samsung enviará al Usuario un correo electrónico confirmando los detalles de la compra.

Los precios ofertados a través de este Portal son exclusivos del mismo y no aplican en tiendas físicas franquiciadas, ni en los establecimientos de terceros, salvo que de forma expresa se indique lo contrario.

El costo de la instalación de los Productos no está incluido en su precio, salvo que expresamente se indique lo contrario. El Usuario podrá consultar en los números #726, (601) 6001272 y 018000112112 para solicitar su instalación. Es necesario que un Centro de Servicio Autorizado por Samsung ("CSA") instale los Productos para no generar eventos que puedan invalidar la garantía.

Existen algunos productos que cuentan con instalación gratuita. El proceso y las referencias que cuentan con este beneficio se detallan en los términos y condiciones publicados en www.samsung.com/co.`,
  },
  {
    title: "5. Métodos de pago",
    content: `El Usuario podrá adquirir los Productos disponibles en el Portal a través de diversos Métodos de Pago como pueden ser: (i) Mercado Pago, mediante el cual se pueden hacer pagos utilizando tarjeta de crédito, PSE, y Efecty, (ii) ADDI. Puede ser necesario que el Usuario cree una cuenta de usuario tanto en Mercado Pago como en ADDI. Lo invitamos a consultar los términos y condiciones de los Métodos de Pago.

En cualquier momento Samsung podrá suspender, limitar, o cancelar, sin responsabilidad alguna, cualquier Método de Pago. Los Métodos de Pago son plataformas propiedad de proveedores independientes y ajenos a Samsung. Samsung no tendrá responsabilidad alguna en caso de fallas en estos.`,
  },
  {
    title: "6. Entrega de los productos",
    content: `Los Productos serán entregados por las empresas transportadores contratadas por Samsung en el domicilio y la dirección proporcionados por el Usuario en el Portal, siempre que éste se ubique dentro del territorio colombiano y únicamente en las ciudades que se mencionan en el Portal al momento de hacer la compra. Existen restricciones de envío, para conocerlas el Usuario debe verificar en el Portal al momento de realizar el pago del Producto. No se realizan envíos internacionales.

El tiempo estimado de entrega será el que se indique al realizar el pago del Producto y hasta 30 días calendario contados a partir de la compra del Producto. Las fechas de entrega son estimadas, por lo que el Usuario acepta y reconoce que pueden presentarse anticipos y demoras razonables en las mismas. No obstante, en caso de que el Usuario no reciba el Producto en el tiempo máximo indicado contado a partir de la recepción de la confirmación de su pedido, el Usuario deberá comunicarse a los números #726, (601) 6001272 y 018000112112 en Bogotá.

La opción de entregas en el mismo día solo es válida para productos de la línea de celulares, para Bogotá D.C. y los municipios cercanos que se indiquen en el Portal al momento de hacer el pago del Producto, y para compras hechas antes de las 10:00 a.m. En caso de que la compra se haga después de dicha hora, esta será entregada el siguiente día.

Las entregas no se pueden realizar en un horario exacto, las mismas son realizadas dentro del tiempo indicado en un horario de lunes a viernes entre las 8:00 am y las 6:00 pm y los sábados entre las 8:00 am y la 1:00 pm.

El Producto podrá ser recibido por la persona indicada por el Usuario al momento de comprar el Producto, para lo cual bastará la firma en la guía del transportador, junto con su identificación y teléfono de contacto.

En caso que el Producto tenga señas de daños o rupturas en su empaque en el momento de la entrega, el Usuario deberá abstenerse de recibir el Producto o en su defecto deberá registrarlo en la guía del transportador como una observación y comunicarse con la línea de servicio al cliente de Samsung a los números #726, (601)6001272 y 018000112112 o al WhatsApp 3138698800 (en horario de Domingo a Domingo de 8:00am - 10:00pm), en un plazo no mayor a cinco (5) días hábiles desde la entrega del producto.

Para los casos que aplique, el Usuario es responsable de la logística y/o costos asociados para ingresar el producto a su domicilio. Si se requiere desarmar el producto o desmontar puertas, trasladar el bien por mecanismos especiales, entre otros, esta logística debe ser coordinada por el Usuario al igual que los costos asociados, los cuales deberán ser asumidos por aquel. Dicha coordinación debe hacerse por medio de la línea de servicio al cliente de Samsung a los números #726, (601)6001272 y 018000112112 o al WhatsApp 3138698800 (en horario de Domingo a Domingo de 8:00am - 10:00pm)`,
  },
  {
    title: "7. Retracto",
    content: `El Usuario tendrá derecho a retractarse de la compra realizada, dentro de los cinco (5) días hábiles siguientes a la entrega del bien, siempre y cuando el Producto esté nuevo, sin abrir, sin uso, en empaque original, con todas sus piezas y manuales completos, al igual que con sellos de seguridad y etiquetas adheridas al mismo.

Para hacer efectivo el derecho de retracto, el Usuario deberá comunicarlo a Samsung con la línea de servicio al cliente de Samsung a los números #726, (601) 6001272 y 018000112112 o al WhatsApp 3138698800 (en horario de domingo a domingo de 8:00am - 10:00pm).

El Usuario deberá devolver el producto y asumir los costos de transporte y demás que conlleve la devolución del bien. En caso de considerarlo conveniente, el Usuario podrá utilizar el servicio de transporte sugerido por Samsung, según las condiciones que Samsung informe, en cuyo caso, expresamente autoriza a Samsung a deducir del dinero a devolver los costos de transporte y demás que conlleve la devolución del bien.

Se exceptúan del derecho de retracto, de acuerdo con la Ley 1480 de 2011, los siguientes casos:

• Los bienes confeccionados conforme a las especificaciones del consumidor o claramente personalizados;
• Los bienes que, por su naturaleza, no puedan ser devueltos o puedan deteriorarse o caducar con rapidez;
• Demás casos establecidos en la ley.

En caso de hacer efectivo el derecho de retracto de acuerdo con las condiciones expuestas, Samsung devolverá en dinero al Usuario. La devolución del dinero al Usuario no podrá exceder de treinta (30) días calendario desde el momento en que ejerció el derecho. La devolución del precio se hará por el mismo medio en que el Usuario hizo su pago, es decir, por medio de Mercado Pago o ADDI.

Para el caso de Mercado Pago, si su pago fue hecho con tarjetas de crédito o débito, el pago puede ser anulado, es decir, no hay cobro o devolución; o la devolución puede ser tramitada ante la red financiera que procesó el pago y acreditada a la cuenta bancaria asociada a la tarjeta. Si su pago fue hecho por PSE o Efecty, la devolución será acreditada a la cuenta Mercado Pago asociada al correo electrónico con el cual usted hizo la compra y tendrá 6 meses para retirar el dinero.

Para el caso de ADDI, una vez acreditado el derecho de retracto, ADDI reversará el crédito. Para confirmar que la reversión haya sido efectiva, usted deberá comunicarse con ADDI.`,
  },
  {
    title: "8. Reversión",
    content: `Cuando el Usuario realice el pago del Producto a través de una tarjeta débito, crédito o cualquier otro Método de Pago electrónico, se reversará dicho pago cuando el Usuario sea sujeto de fraude, cuando la operación corresponda a una no solicitada, cuando el Producto adquirido no sea recibido, o el Producto entregado no corresponda a lo solicitado o sea defectuoso y no admita reparación.

Para que proceda la reversión del pago, dentro los cinco (5) días hábiles siguientes a la fecha en que el Usuario tuvo noticia de la operación fraudulenta o no solicitada o que debió haber recibido el Producto o lo recibió defectuoso o sin que correspondiera a lo solicitado, el Usuario deberá presentar una solicitud ante Samsung y deberá devolver el producto, cuando ello sea procedente. Adicionalmente, el Usuario deberá notificar de la reclamación al emisor del instrumento de pago electrónico utilizado para realizar la compra, el cual, en conjunto con los demás participantes del proceso de pago, procederá a reversar la transacción al Usuario.`,
  },
  {
    title: "9. Garantías",
    content: `Si el Producto presenta un defecto de fabricación y funcionamiento durante su uso normal, el Usuario deberá llamar a los números #726, (601)6001272 y 018000112112 o al WhatsApp 3138698800 (en horario de domingo a domingo de 8:00am - 10:00pm) dentro del período de garantía establecido para cada Producto. En dichos números se le indicará el proceso de validación de garantía y servicio aplicable para el Producto adquirido. El Centro de Servicio Autorizado de Samsung es el único facultado para realizar el diagnóstico de garantía y el proceso a seguir para cumplir con la misma.

La garantía legal del Producto adquirido por el Usuario no será aplicable en los siguientes escenarios:

• Problemas causados por mala manipulación o almacenamiento inadecuado de los productos.
• Productos cuyo periodo de garantía haya finalizado.
• Problemas causados por la instalación y/o reparación efectuada por personal no autorizado por Samsung.
• Productos que presenten modificaciones no autorizadas por Samsung.
• Problemas causados por operación o uso inadecuado (diferente al recomendado en el manual de usuario) o por condiciones ambientales deficientes.
• Problemas causados por transporte inapropiado del equipo.
• Problemas causados por la invasión de elementos extraños al producto como agua, arena, insectos, roedores o similares.
• Problemas causados por fenómenos naturales como: terremotos, inundaciones, tormentas eléctricas, etc., por condiciones accidentales o provocadas como humedad, incendios, fluctuaciones de voltaje, vandalismo, robo o similares.
• Hardware (accesorio, producto, parte) que no sea Samsung y software que no sea Samsung (programa) incluso si es vendido con el hardware Samsung (incluyendo celulares y tablets)
• Daños ocasionados por la instalación de programas o virus mal intencionados que causen conflicto con el sistema operativo original del producto y/o su funcionamiento normal.
• Situaciones ocasionadas por fuerza mayor o caso fortuito.
• Intervención de un tercero no autorizado.
• Las causadas como consecuencia de culpa exclusiva del usuario final o hecho de un tercero.
• Uso indebido del bien por parte del Usuario.
• No atender las instrucciones de instalación, uso o mantenimiento indicadas en el manual de usuario del producto.
• Los demás descritos en el Certificado de Garantía adherido al producto.

Una vez que el CSA reciba los Productos y la garantía se haga procedente de acuerdo con las políticas de Samsung, Samsung, a través del CSA procederá en un primer lugar con la reparación del defecto del Producto y si la falla persiste procederá, a elección del Usuario, a (i) repararlo nuevamente, (ii) devolver el dinero pagado por el Producto por el Usuario, o (iii) reemplazarlo por un producto análogo o de mayor precio siempre que el Usuario pague la diferencia correspondiente.`,
  },
  {
    title: "10. Cambios",
    content: `Samsung ha habilitado la posibilidad de cambio de Producto únicamente por el mismo Producto, pero en distinto color siempre y cuando el Producto esté nuevo, sin abrir, sin uso, en empaque original, con todas sus piezas y manuales completos, al igual que con sellos de seguridad y etiquetas adheridas al mismo.

Si el Usuario desea hacer el cambio, lo puede hacer comunicándose con Samsung a los números #726, (601)6001272 y 018000112112 o por WhatsApp al 3138698800 (en horario de domingo a domingo de 8:00am - 10:00pm) en un plazo de cinco (5) días hábiles luego de la entrega del Producto.

El Usuario deberá devolver el producto y asumir los costos de transporte y demás que conlleve la devolución del bien. En caso de considerarlo conveniente, el Usuario podrá utilizar el servicio de transporte sugerido por Samsung, en cuyo caso, expresamente autoriza a Samsung a deducir del dinero a devolver los costos de transporte y demás que conlleve la devolución del bien.

Tan pronto como Samsung reciba de vuelta el Producto, revisará las condiciones en las que se encuentra el mismo y en un plazo no mayor a quince (15) días hábiles informará al Usuario si cumple con las condiciones establecidas para el cambio.

En caso de que el Producto no cumpla con los criterios establecidos anteriormente, el Usuario será informado vía correo electrónico con la razón por la cual no procede el cambio y el Producto será devuelto a la dirección de envío inicial.`,
  },
  {
    title: "11. Derechos y deberes de los Usuarios del Portal",
    content: `Los derechos de los Usuarios del Portal son aquellos expuestos expresamente en estos Términos y Condiciones y aquellos que por ley les corresponden. Para poder ejercer los derechos descritos en estos Términos y Condiciones, los Usuarios deben cumplir con las condiciones específicas que este documento expone.

Los Usuarios del Portal hacen uso del mismo bajo su propio riesgo, siguiendo lo estipulado en los Términos y Condiciones.`,
  },
  {
    title: "12. Usos permitidos del Portal",
    content: `Salvo indicación contraria en el Portal, el Usuario únicamente estará facultado para ver, imprimir, copiar y distribuir los documentos desplegados en la página, siempre que cumplan con las siguientes condiciones:

1. Que el documento sea utilizado única y exclusivamente con propósitos informativos, personales y no-comerciales;
2. Que cualquier copia del documento o cualquier porción del mismo, incluya en forma ostensible la información relativa a los derechos de propiedad intelectual y/o industrial de los mismos, en la misma forma en que dicha información sea expresada en el documento original desplegado en el Portal, y
3. Que el documento no sea modificado en forma alguna.

Samsung se reserva el derecho de revocar la autorización a que se refiere lo anteriormente enlistado en cualquier tiempo, y, por tanto, el uso por parte del Usuario deberá interrumpirse inmediatamente a partir del momento en que reciba la notificación correspondiente de parte de Samsung.

El aprovechamiento de los Servicios y Contenidos ofrecidos o desplegados en el Portal, es exclusiva responsabilidad del Usuario, quien en todo caso, deberá servirse de ellos acorde a las funcionalidades permitidas en el propio Portal y a los usos autorizados en el presente Contrato, por lo que el Usuario se obliga a utilizarlos de modo tal que no atenten contra las normas de uso y convivencia en Internet, las leyes de Colombia y la legislación vigente en el país en que el Usuario se encuentre al usarlos, las buenas costumbres, la dignidad de la persona y los derechos de Terceros. El Portal es para el uso personal y del Usuario por lo que en ningún caso podrá comercializar de manera alguna los Servicios y Contenidos.`,
  },
  {
    title: "13. Usos no permitidos del Portal",
    content: `No son usos permitidos del Portal, su Contenido y Servicios, los siguientes:

1. Utilizar el Portal para obtener información confidencial para fines distintos a acceder a información respecto de los Productos o Servicios;
2. Usar comercialmente o distribuir la información contenida en el Portal;
3. Usar este Portal o la información disponible en el mismo, de cualquier forma, que pudiera resultar ilícita, ilegal o que constituya una violación a las leyes de Colombia.`,
  },
  {
    title: "14. Derechos de autor y propiedad industrial",
    content: `Los derechos de propiedad intelectual respecto de los Servicios y Contenidos, los signos distintivos y dominios prestados a través de, contenidos en o atenientes a, el Portal, así como los derechos de uso y explotación de los mismos, incluyendo en forma enunciativa pero no limitativa, su divulgación, modificación, transmisión, publicación, venta o comercialización, reproducción y/o distribución, son propiedad exclusiva o de titularidad de Samsung.

El Usuario no adquiere derecho alguno de propiedad intelectual por el simple uso de los Servicios y Contenidos del Portal y en ningún momento dicho uso será considerado como una autorización o una licencia para utilizar los Servicios y Contenidos con fines distintos a los expresamente previstos en los presentes Términos y Condiciones. En consecuencia, el Usuario en ningún caso estará facultado para crear nuevas versiones, distribuir, exhibir o de cualquier forma explotar, cualquiera de los Contenidos desplegados a través de este Portal y que son propiedad exclusiva o de titularidad de Samsung o de otros y que sean utilizados por Samsung bajo licencia de sus respectivos titulares.

Todos los elementos que son consultables en el Portal son de propiedad o titularidad de Samsung. Las marcas, diseños, gráficas, sonidos o imágenes del Portal, propiedad de Samsung, no pueden ser reproducidos o distribuidos, salvo que medie la autorización previa, expresa y por escrito de Samsung.`,
  },
  {
    title: "15. Cookies",
    content: `Las cookies son una pequeña cantidad de datos que generalmente incluye un identificador único anónimo que es enviado al computador o dispositivo del Usuario a través del Portal y almacenado en el disco duro con el fin de salvaguardar sus preferencias de navegación. Este dato almacenado en el disco duro del Usuario ayuda a mejorar el acceso y utilización de los servicios que son ofrecidos por Samsung.

El Usuario acepta que Samsung podrá utilizar Cookies, ya sea para recibirlas o recabarlas. Asimismo, el Usuario reconoce expresamente que las Cookies pueden contener información relativa a la identificación proporcionada por el Usuario o información para rastrear las páginas que el Usuario ha visitado dentro del Portal, en el entendido, sin embargo, de que una Cookie no puede leer los datos o información del disco duro del Usuario, ni leer las Cookies creadas por otros Sitios o Páginas.

De cualquier forma, Samsung informa que el tratamiento de datos personales a través del uso de Cookies se regirá por lo establecido en la Política de Cookies disponible en https://www.samsung.com/co/info/privacy/cookies/, al igual que la Tratamiento de la información de Samsung, la cual puede ser consultada en cualquier momento a través del siguiente enlace: https://www.samsung.com/co/privacy/`,
  },
  {
    title: "16. Comunicaciones",
    content: `Samsung tiene habilitado los siguientes canales para que los Usuarios de la Página hagan ejercicio de sus derechos y presenten todo tipo de quejas, peticiones, reclamos y felicitaciones:

Canales electrónicos: En la parte final de la página web, en el enlace "Contáctenos" y posteriormente en la opción "Más opciones de ayuda". https://contactus.samsung.com/customer/contactus/formmail/mail/MailQuestionGeneralNew.jsp?siteId=27

Canales telefónicos #726, (601)6001272 y 018000112112 o por WhatsApp al 3138698800 (en horario de domingo a Domingo de 8:00am - 10:00pm)

Samsung tendrá el derecho de modificar unilateralmente y en cualquier momento, parte o la totalidad de los presentes Términos y Condiciones. En consecuencia, el Usuario debe leer atentamente los Términos y Condiciones cada vez que pretenda acceder a aquel o realizar operaciones. Ciertos Productos y Servicios ofrecidos a los Usuarios en o a través del Portal, están sujetos a Condiciones Particulares de Venta propias que sustituyen, complementan, y/o modifican, según aplique, los presentes Términos y Condiciones. En consecuencia, el Usuario también debe leer atentamente las Condiciones Particulares relacionadas con los Productos y Servicios.`,
  },
  {
    title: "17. Ley aplicable y resolución de conflictos",
    content: `Para la interpretación, cumplimiento y ejecución de estos Términos y Condiciones, las Partes se someten a la legislación y jurisdicción colombiana, renunciando expresamente a cualquier otro fuero que, por razón de sus domicilios, presentes o futuros, o por cualquier otra causa, pudiere corresponderles.

En caso de controversia o disputa que surja de o en relación con el uso del Portal, las partes intentarán, de inmediato y de buena fe, resolver dicha disputa de manera consensuada. Si la disputa no puede resolverse de común acuerdo, las partes serán libres de ejercer cualquier derecho o recurso disponible para ellos de conformidad con la ley aplicable.

Esta versión de los Términos y Condiciones corresponde a la más vigente, con fecha 30 de septiembre de 2022.`,
  },
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-1">
          {faqItems.map((item, index) => (
            <div key={index} className="bg-gray-100 rounded-lg overflow-hidden w-full">
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between py-6 px-8 text-left hover:bg-gray-200 transition-colors min-h-[80px]"
              >
                <span className="text-lg font-medium text-gray-800 flex-1 pr-4">{item.title}</span>
                <span className="text-2xl font-light text-gray-600 flex-shrink-0 w-8 text-center">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>

              {openIndex === index && (
                <div className="px-8 pb-8 pt-0 bg-gray-50 w-full">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line max-w-full overflow-hidden">
                    {item.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
