/* global ngapp, xelib, registerPatcher, patcherUrl */

let cacheRecords = function(fileId, cache, sig) {
    xelib.GetRecords(fileId || 0, sig, true).forEach(rec => {
        let edid = xelib.EditorID(rec);
        cache[edid] = rec;
    });
};


// this patcher doesn't do anything useful, it's just a heavily commented
// example of how to create a UPF patcher.
registerPatcher({
    info: info,
    // array of the game modes your patcher works with
    // see docs://Development/APIs/xelib/Setup for a list of game modes
    gameModes: [xelib.gmTES5, xelib.gmSSE],
    settings: {
        // The label is what gets displayed as the settings tab's label
        label: 'Challenging Spells Patcher Settings',
        // if you set hide to true the settings tab will not be displayed
        hide: false,
        templateUrl: `${patcherUrl}/partials/settings.html`,
        // controller function for your patcher's settings tab.
        // this is where you put any extra data binding/functions that you
        // need to access through angular on the settings tab.
        controller: function($scope) {
            let patcherSettings = $scope.settings.challengingSpellsUniversalPatcher;


            $scope.showMessage = function() {
                alert(patcherSettings.showPatchedSpellTomes);
            };
        },
        // default settings for your patcher.  use the patchFileName setting if
        // you want to use a unique patch file for your patcher instead of the
        // default zPatch.esp plugin file.  (using zPatch.esp is recommended)
        defaultSettings: {
            showPatchedSpellTomes: false,
            showSkippedBooks: false,
            patchFileName: 'challengingSpellsUniversalSpellPatch.esp'
        }
    },
    // optional array of required filenames.  can omit if empty.
    requiredFiles: ['challenging_spell_learning.esp'],
    getFilesToPatch: function(filenames) {
        // Optional.  You can program strict exclusions here.  These exclusions
        // cannot be overridden by the user.  This function can be removed if you 
        // don't want to hard-exclude any files.
        let gameName = xelib.GetGlobal('GameName');
        return filenames.subtract([`${gameName}.esm`]);
    },
    execute: (patchFile, helpers, settings, locals) => ({
        initialize: function() {
            let fileHandle = xelib.FileByName('challenging_spell_learning.esp');

            // get list of all books by editorID
            let cache = {};
            cacheRecords(fileHandle, cache, 'BOOK');
            locals.skipped_books = [];
            locals.patched_books = [];
            // flames spell tome is edited by the challenging spell learning mod so 
            // we will be using its VMAD(contains scripts) as a base to copy over to all modded added spell tomes.
            let flamesRecord = cache['SpellTomeFlames'];
            locals.challengeVmad = xelib.GetElement(flamesRecord, 'VMAD');
        },
        // a load and a patch function.
        process: [{
            load: {
                signature: 'BOOK',
                filter: function(record) {
                    // only add scripts to books that has the "Teaches Spell" flag AND if the book has no existing scripts attached to it.
                    const hasTeachesSpellFlag = xelib.GetFlag(record, 'DATA\\Flags', 'Teaches Spell');
                    const hasVMADScripts = xelib.HasElement(record, 'VMAD\\Scripts');
                    const shouldPatch = hasTeachesSpellFlag && !hasVMADScripts;
                    if(shouldPatch) {
                        locals.patched_books.push(xelib.LongName(record));
                    } else if(hasTeachesSpellFlag && hasVMADScripts) {
                        locals.skipped_books.push(xelib.LongName(record));
                    }
                    return shouldPatch;
                }
            },
            patch: function(record) {
                
                // set current record's VMAD to CSL's spell tome script by copying it over entirely.
                let newRec = xelib.CopyElement(locals.challengeVmad, record);
                let recScript = xelib.GetScript(record, 'csl_sparks_script');

                //set the LearnedSpell script property to the new spell tome's spell that is meant to be learned after the ritual is done
                let recordSpell = xelib.GetValue(record, 'DATA\\Teaches');
                let learnedSpellProp = xelib.GetScriptProperty(recScript, 'LearnedSpell');
                xelib.SetValue(learnedSpellProp, 'Value\\Object Union\\Object v2\\FormID', recordSpell);

                // set Teaches value to None(-1) and Teaches Spell to a false flag.
                xelib.SetIntValue(record, 'DATA\\Teaches', -1);
                xelib.SetFlag(record, 'DATA\\Flags', 'Teaches Spell', false);
            }
        }],
        finalize: function() {
            
            if(settings.showPatchedSpellTomes && locals.patched_books.length > 0) {
                helpers.logMessage('============================================');
                helpers.logMessage('START of PATCHED Spell Tomes');
                helpers.logMessage('============================================');
                locals.patched_books.forEach(function(book) {
                    helpers.logMessage(book);
                });
                helpers.logMessage('============================================');
                helpers.logMessage('END of PATCHED Spell Tomes');
                helpers.logMessage('============================================');
            } 

            if(settings.showSkippedBooks && locals.skipped_books.length > 0) {
                helpers.logMessage('============================================');
                helpers.logMessage('START of SKIPPED Spell Tomes');
                helpers.logMessage('============================================');
                locals.skipped_books.forEach(function(book) {
                    helpers.logMessage(book);
                });
                helpers.logMessage('============================================');
                helpers.logMessage('END of SKIPPED Spell Tomes');
                helpers.logMessage('============================================');
            } 
            

            helpers.logMessage(`Patched ${locals.patched_books.length} Spell Tomes`);
            helpers.logMessage(`Skipped ${locals.skipped_books.length} Books`);
            helpers.logMessage(`Challenging Spells Patch Complete!`);
        }
    })
});