Projects = new Mongo.Collection('pta-projects'); //runs on both client and server

if (Meteor.isClient) {

    Template.list.rendered = function() {

        var dataSource = new kendo.data.DataSource({
            sort: {
                field: 'score',
                dir: 'desc'
            },
            pageSize: 50
        });

        this.$('#list').kendoListView({
            dataSource: dataSource,
            template: '<tr><td>#:score#</td><td>#:name#</td><td>#:drr</td><td>#:leader</td><td>#:status</td><td><button class="remove" data-id="#:_id#">X</button></td></tr>'
        });

        this.$('#pager').kendoPager({
            dataSource: dataSource
        });

        this.autorun(function() {
            dataSource.data(Projects.find().fetch());
        });
    };

    Template.list.events({
        'click .remove': function(event) {
            Projects.remove($(event.target).data('id'));
        }
    });

    Template.addForm.events({
        'submit .addForm': function(event) {

            Projects.insert({
                name: event.target.name.value,
                score: Number(event.target.score.value)
            });

            // Clear form
            event.target.name.value = '';
            event.target.score.value = '';

            return false;

        }
    });
}

if (Meteor.isServer) {

    Meteor.startup(function() {

        if (Projects.find().count() === 0) {
            var names = ['Ada Lovelace', 'Grace Hopper', 'Marie Curie', 'Carl Friedrich Gauss'];
            _.each(names, function(name) {
                Projects.insert({
                    name: name,
                    score: Math.floor(Random.fraction() * 10) * 5
                });
            });
        }
    });

}
