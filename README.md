# Challenging Spells Universal Patcher
Patch to convert all spell tomes to use "Challenging Spells" Method of spell learning. Will look for all books that has the "Teaches Spell" Flag set to true but will skip any spell tome that already has VMAD/scripts attached to it to ensure compatiblity.  

Challenging spells: https://www.nexusmods.com/skyrimspecialedition/mods/20521  

Created using [ZEdit](https://github.com/z-edit/zedit) and the [ZEdit Unified Patching Framework](https://github.com/z-edit/zedit-unified-patching-framework)  

Credits to tjhm4 for creating the original mod and mator for creating zedit.

**Warning:** zEdit currently installs from archive incorrectly. The instructions crossed out below only apply once archive installation is fixed for zEdit.

## Instructions
1. Download the latest version of the patcher archive from the `Releases` tab on this page
2. Download zEdit from the `Releases` Tab [here](https://github.com/z-edit/zedit)
    - Use the portable version **OR** the setup version
3. (Optional) Add zEdit as a tool to your mod manager/mod organizer
4. Extract the contents of `challengingSpellsUniversalPatcher-v1.0.zip` to the `zEdit_Alpha_v0.4.3_-_Portable_x64/modules/` folder to install this patcher.

~~4. On the top right corner click on the icon with the boxes that says `Manage Extensions`~~  
~~5. Click on the `Install Module` button~~  
~~6. Select the archive `challengingSpellsUniversalPatcher_v1.0.zip` you downloaded in `Step 1` and click `Open`~~  
~~7. Click on the `Restart Now` button for zEdit to restart it.~~  
~~8. zEdit should be relaunched, choose your game version.~~  

8. Launch zEdit, select your game
9. Select all the esps/esms who's spell tomes you want to convert to the challenging spells mod system
    - make sure to **INCLUDE challenging_spell_learning.esp**
10. Right click in the left pane and click on `Manage Patchers`
11. (Optional) Click on `Challenging spells Patcher settings` on the left hand pane
    - Here you can choose to print the patched spell tomes/skipped spell tomes to the log
12. `Challenging Spells Universal Patcher` should be visible, click on the `Build` button next to it.
13. If successful, then you can now close zEdit and save the plugin changes.
14. DONE!
