export const verifySession = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json('No valid session');
    }
    next();
};

export const verifyEO = (req, res, next) => {
    verifySession(req, res, () => {
        if (req.session.user && req.session.user.role === 'EO') next (); 
        else return  res.status(403).json('Not allowed');
    });
};

export const verifyParticipant = (req, res, next) => {
    verifySession(req, res, () => {
        if (req.session.user && req.session.user.role === 'PARTICIPANT') next (); 
        else return  res.status(403).json('Not allowed');
    });
};
