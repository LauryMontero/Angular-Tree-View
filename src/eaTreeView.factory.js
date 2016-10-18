angular.module('ea.treeview').factory('eaTreeViewFactory', function($rootScope) {
    // hide the object from external forces (of evil)
    var concealed = {
        items: []
    };

    // expose a public object with access methods
    var visible = {
        // allow the user to opt-in to listening for the ui-router $stateChangeSuccess event
        // or any other event they want to specify (in case they're not using ui-router)
        bindEvent: function(name) {
            name = name || '$stateChangeSuccess';
            $rootScope.$on(name, function (event, args) {
                visible.setActive(args.name);
            });
        },
        // get the concealed items array
        getItems: function() {
            return concealed.items;
        },
        // set the active item and expand all ancestors of the active item
        setActive: function(state, items, matchFound, nestingLevel, stopExpandingParents) {
            // initialize whatever wasn't passed to a default value
            items = items || concealed.items;
            matchFound = matchFound || false;
            nestingLevel = nestingLevel || 0;

            for (var i = items.length; --i >= 0;) {
                if (!!items[i].items && !!items[i].items.length) {
                    // matchFound here would mean that a match was found in a descendant
                    matchFound = visible.setActive(state, items[i].items, matchFound, nestingLevel + 1, stopExpandingParents);
                    if (matchFound && !stopExpandingParents) {
                        items[i].expanded = true;
                        if (nestingLevel === 0) {
                            stopExpandingParents = true;
                        }
                    }
                } else {
                    if (matchFound) {
                        // matchFound here would mean either a sibling node or some other node was already matched
                        // so we want to skip the comparison to save time
                        items[i].isActive = false;
                    } else {
                        if (!!items[i].stateName && items[i].stateName === state) {
                            // if the item's state is the one being searched for then set the item to active and flip the matched flag
                            items[i].isActive = true;
                            matchFound = true;
                        } else {
                            items[i].isActive = false;
                        }
                    }
                }
            }

            return matchFound;
        },
        // set the conealed items array
        setItems: function(items) {
            concealed.items = items;
        }
    };

    return visible;
});