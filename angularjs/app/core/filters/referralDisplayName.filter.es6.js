const referralDisplayName = function() {
    'ngInject';

    return function(referralModel, withDetails) {
        if (!referralModel) {
            return '';
        }

        let modelSource = referralModel.ReferralCardSource || referralModel.Physician || referralModel;
        let name = modelSource.Name && modelSource.Name.FullName
            || modelSource.PhysicianName && modelSource.PhysicianName.FullName
            || '';
        let practice = modelSource.Practice;
        let referralDetails = '';
        let npi = modelSource.Npi ? `(NPI: ${modelSource.Npi})` : '';

        if (withDetails) {
            referralDetails = ` ${npi}`;
        }

        if (withDetails && name) {
            referralDetails += `${practice ? ` (${practice})` : ''}`;
        }

        if (name) {
            return name + referralDetails;
        }

        return practice ? practice + referralDetails : '-';
    };
};

export default referralDisplayName;
