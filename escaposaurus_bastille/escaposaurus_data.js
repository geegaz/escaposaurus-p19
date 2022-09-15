
/////////////////////////////////////////////////////////////
/// Escapausorus v1 (2020)
///	A quick and dirty framework to create small adventure game (certified vanilla JS)
/// Author: Stéphanie Mader (http://smader.interaction-project.net)
/// GitHub: https://github.com/RedNaK/escaposaurus
///	Licence: MIT
////////////////////////////////////////////////////////////

/*
	HERE IS THE CONFIGURATION OF THE GAME
*/
/*either online with VOD server and JSON load of data
either local */
var isLocal = true ;
var gameRoot = "./" ;
var gameDataRoot = gameRoot+"escaposaurus_bastille/" ;
var videoRoot = gameDataRoot+"videos/" ;

/*caller app*/
var contactVideoRoot = videoRoot+"contactVideo/" ;

/*full path to intro / outro video*/
var missionVideoPath = videoRoot+"introVideo/intro1.mp4" ;
var introVideoPath = videoRoot+"introVideo/intro2.mp4" ;
var missingVideoPath = videoRoot+"contactVideo/missing/final.mp4" ;
var epilogueVideoPath = videoRoot+"epilogueVideo/epiloguecredit.mp4" ;

/*udisk JSON path*/
var udiskRoot = gameDataRoot+"udisk/" ;

/*for online use only*/
/*var udiskJSONPath = gameRoot+"escaposaurus_gamedata/udisk.json" ;
var udiskJSONPath = "/helper_scripts/accessJSON_udisk.php" ;*/

var udiskData =
{
	"root":{
		"files":[
			"Caisse_bastille.png",
			"Journal_du_22_janvier.png",
			"Mamie_devant_bastille.png",
			"Testament_copie.jpg"
		],
		"folders":[
			{
				"foldername":"Cuisine_Recettes",
				"password":"le roy",
				"sequence":0,
				"files":[
					"Emission de radio.mp4",
					"IMG_52164809.png", 
					"Recette_creme_anglaise.png", 
					"Recette_ile_flottante.png",
					"Recette_caramel.png"
				]
			},
			{
				"foldername":"Documents",
				"password":"15",
				"sequence":1,
				"folders":[
					{
						"foldername":"Business",
						"password":"chips",
						"sequence":2, 
						"files":[
							"Testament_original.png",
						]
					}
				],
				"files":[
					"clef_de_dechiffrement.png"
				]
			}
		]
	}
};

var gameTitle = "Affaire Bastille" ;
var gameDescriptionHome = "Ceci est une courte aventure d'exemple pour montrer ce que le framework Escaposaurus permet facilement de réaliser.<br/>Le code source est téléchargeable sur <a href='https://github.com/RedNaK/escaposaurus' target='_blank'>GitHub</a>" ;
var gameMissionCall = "Voici la vidéo que la commissaire Renée Froncet a envoyé à votre bureau d'informaticien spécialisé en décryptage de données" ;
var gameMissionAccept = "&raquo;&raquo; Accepter la mission et charger le disque dur dans le serveur virtuel (JOUER) &laquo;&laquo;" ;

var gameCredit = "Un jeu conçu et réalisé par : <br/>Solenn, Noé, Tanguy, Axelle, William, Louise" ;
var gameThanks = "Remerciements : <br/> ;)" ;

var OSName = "Special InformaticienOS 3.11- diskloaded: Affaires_Bastille" ;
var explorerName = "USB DISK EXPLORER" ;
var callerAppName = "CALL CONTACT" ;

/*titles of video windows*/
var titleData = {} ;
titleData.introTitle = "INTRODUCTION" ;
titleData.epilogueTitle = "EPILOGUE" ;
titleData.callTitle = "APPEL EN COURS..." ;

/*change of caller app prompt for each sequence*/
var promptDefault = "Rien à demander, ne pas les déranger." ;
var prompt = [] ;
prompt[0] = "Prendre contact" ;
prompt[1] = "Prendre contact" ;
prompt[2] = "" ;
prompt[3] = "Appeler la commissaire pour lui montrer le testament" ;

/*when the sequence number reach this, the player win, the missing contact is added and the player can call them*/
var sequenceWin = 3;

/*before being able to call the contacts, the player has to open the main clue of the sequence as indicated in this array*/
/*if you put in the string "noHint", player will be able to immediatly call the contact at the beginning of the sequence*/
/*if you put "none" or anything that is not an existing filename, the player will NOT be able to call the contacts during this sequence*/
var seqMainHint = [] ;
seqMainHint[0] = "Journal_du_22_janvier.png" ;
seqMainHint[1] = "Recette_creme_anglaise.png" ; /*if you put anything that is not an existing filename of the udisk, the player will never be able to call any contacts or get helps during this sequence*/
seqMainHint[2] = "noHint" ;
seqMainHint[3] = "none" ;

/*contact list, vid is the name of their folder in the videoContact folder, then the game autoload the video named seq%number of the current sequence%, e.g. seq0.MP4 for the first sequence (numbered 0 because computer science habits)
their img need to be placed in their video folder, username is their displayed name
*/
var normalContacts = [] ;
normalContacts[0] = {"vid" : "Commissaire", "vod_folder" : "", "username" : "Renée Froncet (Commissaire)", "canal" : "video", "avatar" : "Commissaire_avatar.png"} ;
normalContacts[1] = {"vid" : "Journaliste", "vod_folder" : "", "username" : "Amandine Financier (Journaliste)", "canal" : "video", "avatar" : "Journaliste_avatar.png"} ;

/*second part of the list, contact that can help the player*/
var helperContacts = [] ;
/*helperContacts[1] = {"vid" : "Lou", "username" : "Lou (pour avoir un deuxième indice) - par message", "canal" : "txt", "avatar" : "Lou_opt.jpg", "bigAvatar" : "avatarHelper2Big.gif"} ;*/


/*ce qui apparait quand on trouve le dernier élément du disque dur*/
finalStepAdded = "Informations sur le testament original transmises." ;

/*the last call, it can be the person we find in the end or anyone else we call to end the quest, allows the game to know it is the final contact that is called and to proceed with the ending*/
var missingContact = {"vid" : "missing", "vod_folder" : "","username" : "Renée Froncet (Commissaire)",  "canal" : "video", "avatar" : "Commissaire_avatar.png"} ;

/*Lou only send text message, they are stored here*/
var tips = {} ;
/*
tips['Commissaire'] = [] ;
tips['Commissaire'][0] = "Je peux pas répondre à votre appel. Mais je peux vous répondre par écrit. Donc vous cherchez le surnom de Pierre ? Il se fait appeler le \"roi\". Mais ça n'est pas la bonne orthographe." ;
tips['Commissaire'][1] = "" ;
tips['Commissaire'][2] = "" ;
tips['Commissaire'][3] = "Ah zut, un dossier verouillé sans infos dans scan mémo ? Y'a forcément un truc mnémotechnique facile à retenir ou retrouver. Les guides en disent quoi ?" ;
*/

/*text for the instruction / solution windows*/
var instructionText = {} ;
instructionText.winState = "Vous avez retrouvé l'id GPS et vous pouvez appeler les secours du secteur." ;
instructionText.lackMainHint = "" ;
instructionText.password = "Vous devez trouver et entrer le mot de passe d'un des dossiers de la boite de droite. Vous pouvez trouver le mot de passe en appelant les contacts de la boite de gauche.<br/>Pour entrer un mot de passe, cliquez sur le nom d'un dossier et une fenêtre s'affichera pour que vous puissiez donner le mot de passe." ;

/*please note the %s into the text that allow to automatically replace them with the right content according to which sequence the player is in*/
var solutionText = {} ;
solutionText.winState = "Si la vérité sur le testament a été rétablie, le jeu est fini bravo." ;
solutionText.lackMainHint = "Vous devez ouvrir le fichier <b>%s</b><br/>" ;
solutionText.password = "Vous devez déverouiller le dossier <b>%s1</b><br/>avec le mot de passe : <b>%s2</b><br/>" ;