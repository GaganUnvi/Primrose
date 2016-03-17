/*
 * Copyright (C) 2015 Sean T. McBeth <sean@seanmcbeth.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* global pliny, Primrose, THREE */

window.Primrose = ( function () {
  "use strict";

  pliny.namespace( "Primrose", "Primrose helps you make VR applications for web browsers as easy as making other types of interactive web pages.\n\nThis top-level namespace contains classes for manipulating and viewing 3D environments." );
  var Primrose = {};

  pliny.namespace("Primrose.DOM", "A few functions for manipulating DOM.");
  Primrose.DOM = {};

  pliny.namespace("Primrose.Input", "The Input namespace contains classes that handle user input, for use in navigating the 3D environment.");
  Primrose.Input = {};

  pliny.namespace("Primrose.Network", "The Network namespace contains classes for communicating events between entities in a graph relationship across different types of communication boundaries: in-thread, cross-thread, cross-WAN, and cross-LAN.");
  Primrose.Network = {};

  pliny.namespace( "Primrose.Output", "The Output namespace contains classes that handle output to devices other than the screen (e.g. Audio, Music, etc.)." );
  Primrose.Output = {};

  pliny.namespace( "Primrose.Text", "The Text namespace contains classes everything regarding the Primrose source code editor." );
  Primrose.Text = {};

  pliny.namespace( "Primrose.Text.CodePages", "The CodePages namespace contains international keyboard parameters." );
  Primrose.Text.CodePages = {};

  pliny.namespace( "Primrose.Text.CommandPacks", "The CommandPacks namespace contains sets of keyboard shortcuts for different types of text-oriented controls." );
  Primrose.Text.CommandPacks = {};

  pliny.namespace( "Primrose.Text.Controls", "The Controls namespace contains different types of text-oriented controls." );
  Primrose.Text.Controls = {};

  pliny.namespace( "Primrose.Text.Grammars", "The Grammars namespace contains grammar parsers for different types of programming languages, to enable syntax highlighting." );
  Primrose.Text.Grammars = {};

  pliny.namespace( "Primrose.Text.OperatingSystems", "The OperatingSystems namespace contains sets of keyboard shortcuts for different operating systems." );
  Primrose.Text.OperatingSystems = {};

  pliny.namespace( "Primrose.Text.Renderers", "The Renderers namespace contains different renderers for using the general Text Editor logic in different output systems. Current, Canvas2D is the only system that works. A system for DOM elements exists, but it is broken and not likely to be fixed any time soon." );
  Primrose.Text.Renderers = {};

  pliny.namespace( "Primrose.Text.Themes", "The Themes namespace contains color themes for text-oriented controls, for use when coupled with a parsing grammar." );
  Primrose.Text.Themes = {};

  pliny.value( "Primrose", {
    name: "SYS_FONTS",
    type: "String",
    description: "A selection of fonts that will match whatever the user's operating system normally uses."
  } );
  Primrose.SYS_FONTS = "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif";

  pliny.value( "Primrose", {
    name: "SKINS",
    type: "Array of String",
    description: "A selection of color values that closely match skin colors of people."
  } );
  Primrose.SKINS = [ "#FFDFC4", "#F0D5BE", "#EECEB3", "#E1B899", "#E5C298", "#FFDCB2",
    "#E5B887", "#E5A073", "#E79E6D", "#DB9065", "#CE967C", "#C67856", "#BA6C49",
    "#A57257", "#F0C8C9", "#DDA8A0", "#B97C6D", "#A8756C", "#AD6452", "#5C3836",
    "#CB8442", "#BD723C", "#704139", "#A3866A", "#870400", "#710101", "#430000",
    "#5B0001", "#302E2E" ];

  pliny.value( "Primrose", {
    name: "SKIN_VALUES",
    type: "Array of Number",
    description: "A selection of color values that closely match skin colors of people."
  } );
  Primrose.SKIN_VALUES = Primrose.SKINS.map( function ( s ) {
    return parseInt( s.substring( 1 ), 16 );
  } );

  pliny.function( "Primrose", {
    name: "loadTexture",
    description: "Load a texture! Reads the THREE.ImageUtils.crossOrigin property to configure the Cross-Origin policy.",
    paramters: [
      {name: "url", type: "String", description: "The URL of the image to load as a texture."},
      {name: "onLoad", type: "Function", description: "A callback for when the texture loads successfully."},
      {name: "onProgress", type: "Function", description: "A callback for when the progress is made on loading the texture."},
      {name: "onError", type: "Function", description: "A callback for if the texture fails to load."}
    ]
  } );
  var textureLoader = new THREE.TextureLoader();
  Primrose.loadTexture = function ( url, onLoad, onProgress, onError ) {
    textureLoader.setCrossOrigin( THREE.ImageUtils.crossOrigin );
    textureLoader.load( url, onLoad, onProgress, onError );
  };

// snagged and adapted from http://detectmobilebrowsers.com/
  pliny.value( "", {
    name: "isMobile",
    type: "Boolean",
    description: "Flag indicating the current system is a recognized \"mobile\"\n\
device, usually possessing a motion sensor."
  } );
  window.isMobile = ( function ( a ) {
    return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
        a ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            a.substring( 0, 4 ) );
  } )( navigator.userAgent || navigator.vendor || window.opera );

  pliny.value( "", {
    name: "isiOS",
    type: "Boolean",
    description: "Flag indicating the current system is a device running the Apple\n\
iOS operating system: iPad, iPod Touch, iPhone. Useful for invoking optional code\n\
paths necessary to deal with deficiencies in Apple's implementation of web standards."} );
  window.isiOS = /iP(hone|od|ad)/.test( navigator.userAgent || "" );


  pliny.value( "", {
    name: "isOSX",
    type: "Boolean",
    description: "Flag indicating the current system is a computer running the Apple\n\
OSX operating system. Useful for changing keyboard shortcuts to support Apple's\n\
idiosynchratic, concensus-defying keyboard shortcuts."
  } );
  window.isOSX = /Macintosh/.test( navigator.userAgent || "" );

  pliny.value( "", {
    name: "isWindows",
    type: "Boolean",
    description: "Flag indicating the current system is a computer running one of\n\
the Microsoft Windows operating systems. We have not yet found a use for this flag."
  } );
  window.isWindows = /Windows/.test( navigator.userAgent || "" );

  pliny.value( "", {
    name: "isOpera",
    type: "Boolean",
    description: "Flag indicating the browser is currently calling itself Opera.\n\
Opera is a substandard browser that lags adoption of cutting edge web technologies,\n\
so you are not likely to need this flag if you are using Primrose, other than to\n\
cajole users into downloading a more advanced browser such as Mozilla Firefox or\n\
Google Chrome."
  } );
  window.isOpera = !!window.opera || navigator.userAgent.indexOf( ' OPR/' ) >= 0;

  pliny.value( "", {
    name: "isSafari",
    type: "Boolean",
    description: "Flag indicating the browser is currently calling itself Safari.\n\
Safari is an overly opinionated browser that thinks users should be protected from\n\
themselves in such a way as to prevent users from gaining access to the latest in\n\
cutting-edge web technologies. Essentially, it was replaced Microsoft Internet\n\
Explorer as the Internet Explorer of the web."
  } );
  window.isSafari = Object.prototype.toString.call( window.HTMLElement ).indexOf( 'Constructor' ) > 0;

  pliny.value( "", {
    name: "isChrome",
    type: "Boolean",
    description: "Flag indicating the browser is currently calling itself Chrome\n\
or Chromium. Chromium was one of the first browsers to implement virtual reality\n\
features directly in the browser, thanks to the work of Brandon \"Toji\" Jones."
  } );
  window.isChrome = !!window.chrome && !window.isOpera;

  pliny.value( "", {
    name: "isFirefox",
    type: "Boolean",
    description: "Flag indicating the browser is currently calling itself Firefox.\n\
Firefox was one of the first browsers to implement virtual reality features directly\n\
in the browser, thanks to the work of the MozVR team."
  } );
  window.isFirefox = typeof window.InstallTrigger !== 'undefined';

  pliny.value( "", {
    name: "isWebKit",
    type: "Boolean",
    description: "Flag indicating the browser is one of Chrome, Safari, or Opera.\n\
WebKit browsers have certain issues in common that can be treated together, like\n\
a common basis for orientation events."
  } );
  window.isWebKit = window.isiOS || window.isOpera || window.isChrome;

  pliny.value( "", {
    name: "isIE",
    type: "Boolean",
    description: "Flag indicating the browser is currently calling itself Internet\n\
Explorer. Once the bane of every web developer's existence, it has since passed\n\
the torch on to Safari in all of its many useless incarnations."
  } );
  window.isIE = /*@cc_on!@*/false || !!document.documentMode;

  pliny.issue( "", {
    name: "Make a getting started page.",
    type: "closed",
    description: "Make a page that explains downloading the right dependencies,\n\
making a simple page using a sample scene, making it VR capable, and adding\n\
objects to it."
  } );

  pliny.issue( "", {
    name: "Make a simple Blender tutorial.",
    type: "open",
    description: "Show where to download Blender and how to use it to make a smooth-shaded,\n\
flat color, low-poly scene and make it VR ready."
  } );

  pliny.issue( "", {
    name: "Make a more advanced Blender tutorial.",
    type: "open",
    description: "Show how to do texturing in Blender."
  } );

  pliny.issue( "", {
    name: "Make a simple lighting tutorial.",
    type: "open",
    description: "Basic point and spot lights."
  } );

  pliny.issue( "", {
    name: "Make a simple video tutorial.",
    type: "open",
    description: "Put a quad in the scene on which a movie can play. Make it look\n\
like a drive-in to be really cool."
  } );

  pliny.issue( "", {
    name: "Make a drum machine tutorial.",
    type: "open",
    description: "Show how to create elements and useful interactions with those elements."
  } );

  pliny.issue( "", {
    name: "Make a 3D IDE tutorial.",
    type: "open",
    description: "Show how to build the 3D editor demo."
  } );

  pliny.issue( "", {
    name: "Make a basic server tutorial.",
    type: "open",
    description: "Show how to setup a basic Node WebSockets server to be able to do\n\
multiplayer chat."
  } );

  pliny.issue( "", {
    name: "Make an adventure demo.",
    type: "open",
    description: "Make a small adventure game of locked treasure chests and mazes."
  } );

  pliny.issue( "", {
    name: "Make an HMD overview page.",
    type: "open",
    description: "Go into what is available, what are the key components, and how\n\
to build your own Google Cardboard."
  } );

  pliny.issue( "", {
    name: "Make a tutorial on modeling a scene with Primrose and saving/exporting it.",
    type: "open",
    description: "Live program a scene and save it to an HTML file that can be put up\n\
on a website and be ready to run in VR."
  } );

  pliny.issue( "", {
    name: "Make a CHANGELOG",
    type: "open",
    description: "Document the changes between versions better."
  } );

  pliny.issue( "", {
    name: "Make better icons for full-screen view.",
    type: "open",
    description: "The current icons don't match each other, and they are in a bad place on screen."
  } );

  pliny.issue( "", {
    name: "Link examples to each other.",
    type: "open",
    description: "Make it so you can jump from one example to another, both in 2D and VR contexts."
  } );

  pliny.issue( "", {
    name: "Make more examples on CodePen.",
    type: "open",
    description: "Demonstrate using Primrose with the different options available in CodePen."
  } );

  pliny.issue( "", {
    name: "Update the README.",
    type: "open",
    description: "It's woefully out of date."
  } );

  pliny.issue( "", {
    name: "Make Haptic Glove tutorial.",
    type: "open",
    description: "Offer the supplies for sale, and show how to build a haptic glove\n\
that can be used with Primrose."
  } );

  pliny.issue( "", {
    name: "Adopt ES6.",
    type: "open",
    description: "Classes and arrow functions are good. Rely on browser support for\n\
development. Setup a transpiler for production builds."
  } );

  pliny.issue( "", {
    name: "Figure out a better module system.",
    type: "open",
    description: "I still want Primrose to be an \"Include one JS file\" type of library\n\
for working in browsers. But I also want the component parts to work well with Node\n\
and other neuveau JS shenanigans."
  } );

  pliny.issue( "", {
    name: "Investigate compatability with A-Frame.",
    type: "open",
    description: "If it's easy, it won't hurt."
  } );

  pliny.issue( "", {
    name: "Investigate compatability with SceneVR.",
    type: "open",
    description: "If it's easy, it won't hurt."
  } );

  pliny.issue( "", {
    name: "Investigate compatability with Vizor.",
    type: "open",
    description: "If it's easy, it won't hurt."
  } );

  pliny.issue( "", {
    name: "Investigate compatability with X3D.",
    type: "open",
    description: "If it's easy, it won't hurt."
  } );

  pliny.issue( "", {
    name: "Investigate compatability with JanusVR.",
    type: "open",
    description: "If it's easy, it won't hurt."
  } );

  pliny.issue( "", {
    name: "Investigate compatability with AltspaceVR.",
    type: "open",
    description: "If it's easy, it won't hurt."
  } );

  return Primrose;
} )();