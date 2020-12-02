This is a simple to use implementation of the 4E GURPS character sheet for use with Foundry VTT. It should be compatible with foundry version 0.7.5 and higher.  Bugs, feedback or suggestions are welcome. The goal here is to provide a quick to setup and play system, not to automate the myriad modifiers and situational components of GURPS.  Any and all modifiers should be calculated and called by the players or GM and applied during play.  Using the alt key when clicking a roll button will provide a simple dialog to imput the modifier before rolling. No different than being at a physical table with paper character sheets.

We provide no pre-made skills, traits or other components, but you can easily build those from your GURPS books using the system!

GURPS is a trademark of Steve Jackson Games, and its rules and art are copyrighted by Steve Jackson Games. All rights are reserved by Steve Jackson Games. This Foundry VTT System is the original creation of David Rogers and is released for free distribution, and not for resale, under the permissions granted in the <a href="http://www.sjgames.com/general/online_policy.html">Steve Jackson Games Online Policy</a>.

Layout and HTML for the Notes tab was adapted from alt5e by Sky.  
https://github.com/Sky-Captain-13/foundry/tree/master/alt5e

<ul>
<li>TODO - add equip toggle on inventory items </li>
<li>TODO - calculate DR by location based on equiped status of appropriate items (currently implemented the most basic all damage to center mass rules</li>
<li>TODO - Implement block attribute on equipment to allow for shield skill and block </li>
<li>TODO - update weapon items with damage formula to facilitate roll generation</li>
<li>TODO - add damage roll to chat card on weapon rolls</li>
<li>TODO - create character template item </li>
<li>TODO - prevent duplicate skills on character sheet </li>
<li>TODO - Sucess/Failure and margin on Rolls</li>
<li>TODO - Call out Crit/Fumble on rolls</li>
<li>TODO - Beutification and Layout optimization - 90% complete</li>
<li>TODO - add fields to spell items for extra data</li>
<li>TODO - add info and layout items to the rolldown for owned items</li>
<li>TODO - verify all strings have been localized</li>
<li>TODO - Update trait items to have trait type as subtitle at top of card.</li>
<li>TODO - Implement Psionics</li>
<li>TODO - Implement Techniques</li>
<li>TODO - system settings - skin system based on 'theme' </li>
<li>TODO - skins - set up Fantasy, Modern, Western, Cyberpunk and Sci-Fi themed css skins </li>
</ul>


<h3>0.6.1</h3>
<ul>
    <li> updated data model for weapons to allow for multiple damage options</li>
    <li> updated weapon item card to lay ground work for implementing proper damage rolls</li>
    <li> added ability to add damage types to weapon items</li>
</ul>


<h3>0.6.0</h3>

<ul>
    <li> this is considered the first playable implementation - All core rules are usable with this sheet</li>
    <li> Implemented single location DR</li>
    <li> Updated css layout to make sheet more organized</li>
    <li> Implemented all rollable items</li>
</ul>



