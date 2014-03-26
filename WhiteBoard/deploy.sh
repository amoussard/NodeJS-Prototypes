#!/bin/bash
# Déploiement

# Chargement des settings
SETTINGSLOADED=0
# Par défaut : dry-run activé
DRYRUN=1
# Environnement cible par défaut : prod
TARGET=""
# Les suppression ne sont pas synchronisées par défaut
DELETE=0
# Adresse mail du rapport
REPORTEMAIL=""
# Nom du projet
PROJECTNAME=""


. settings.inc.sh $*

if ((${SETTINGSLOADED} == 0)); then
    echo "Les settings ont mal été chargés"
    exit 1
fi

if [ -z $TARGET ]; then
    echo "Veuillez spécifier un environnement"
    exit 1
fi

echo -e "\033[1mEnvironnement cible : ${TARGET}.\033[0m" >&2


DESTINATION="${DESTINATION_USER}@${DESTINATION_HOST}:${DESTINATION_PATH}"

## Réglages de déploiement
# Arguments :
# -C : Ignore tous les fichiers type CVS
# -L : Déréférence les liens symboliques pour le transfert (la cible du lien est transférée)
# -v : Mode verbose
# -z : Compression
# -r : Parcours récursif
# -D : Préserve les fichiers spéciaux
# -n : mode Dry-Run
# -c : Vérifie le checksum (plutot que la date)
# -l : copy symlinks as symlinks
ARGS="-rlcvCz"

if ((${DRYRUN} == 1)); then
    ARGS="${ARGS}n"
fi
if ((${DELETE} == 1)); then
    ARGS="${ARGS} --delete"
fi


# Se déplace à la racine des sources et lance la synchro
echo "PASSPHRASE : "${PASS}
cd ${SOURCE}
echo "${TARGET}" > ${LOGFILE}
RSYNC_CMD="rsync ${ARGS} ${EXCLUDE} . ${DESTINATION} --progress | grep -iE \"\..*$\" >> ${LOGFILE}"
echo ${RSYNC_CMD}

echo -e "\nFichiers à synchroniser :" >> ${LOGFILE}
rsync ${ARGS} ${EXCLUDE} . ${DESTINATION} --progress | grep -iE "\..*$" >> ${LOGFILE}


# Envoi de mail
SUBJECT="RSYNC ${PROJECTNAME} : ILIAD -> ${TARGET}"
if ((${DRYRUN} == 1)); then
    SUBJECT="${SUBJECT} DRY-RUN"
fi
mail -s "${SUBJECT}" ${REPORTEMAIL} < ${LOGFILE}

echo "Terminé, consultez le log ${LOGFILE}"
