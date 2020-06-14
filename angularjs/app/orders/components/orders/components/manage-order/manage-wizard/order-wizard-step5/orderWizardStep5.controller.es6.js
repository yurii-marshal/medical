export default class orderWizardStep5Controller {
    constructor(
        orderWizardService,
        bsLoadingOverlayService,
        ordersService
    ) {
        'ngInject';

        this.model = orderWizardService.getModel();
        this.orderWizardService = orderWizardService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.ordersService = ordersService;

        this.bsLoadingOverlayService.start({ referenceId: 'loadingTags' });

        this.model.Tags = this.model.Tags.filter((tag) => !tag.blockRemove);

        this.orderWizardService.getRestrictionTags()
            .then((response) => {
                const restrictionTags = response.data;

                restrictionTags.forEach((restrictionTag) => {
                    const foundTag = this.model.Tags.find((tag) => tag.Id === restrictionTag.Id);

                    if (!foundTag) {
                        restrictionTag.blockRemove = true;
                        restrictionTag.attrClass = this.ordersService.getAttrClass(restrictionTag.Name);
                        this.model.Tags.push(restrictionTag);
                    } else {
                        foundTag.blockRemove = true;
                    }
                });
            })
            .finally(() => {
                this.bsLoadingOverlayService.stop({ referenceId: 'loadingTags' });
            });
    }
}
